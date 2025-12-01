import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { Plus, Trash2, X, Tags, AlertCircle, FileText, Tag as TagIcon } from "lucide-react";
import { apiService, Tag, extractErrorMessage, extractValidationErrors } from "../services/apiService";

interface TagsPageProps {
  isAuthenticated: boolean;
}

const TagsPage: React.FC<TagsPageProps> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null); // For validation errors in modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      setTags(response);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load tags. Please try again later."));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async () => {
    if (newTags.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError(null); // Clear previous validation errors
      setError(null); // Clear general error
      
      await apiService.createTags(newTags);
      await fetchTags();
      handleModalClose();
    } catch (err) {
      const validationErrors = extractValidationErrors(err);
      
      // Check if there are field-specific validation errors
      if (Object.keys(validationErrors).length > 0) {
        // Display validation errors - could be for "names", "names[0]", etc.
        const errorMessages = Object.values(validationErrors);
        // Show the first validation error or combine them
        setValidationError(errorMessages[0] || 'Validation error occurred');
      } else {
        // If no validation errors, show general error message
        setError(extractErrorMessage(err, "Failed to create tags. Please try again."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteTag(tag.id);
      await fetchTags();
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete tag. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setNewTags([]);
    setTagInput("");
    setValidationError(null); // Clear validation errors when closing modal
    setError(null); // Clear general error
    onClose();
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().toLowerCase();
      if (value && !newTags.includes(value)) {
        setNewTags([...newTags, value]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && newTags.length > 0) {
      setNewTags(newTags.slice(0, -1));
    }
  };

  const handleRemoveNewTag = (tagToRemove: string) => {
    setNewTags(newTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tags className="text-primary" size={24} />
            <h1 className="text-2xl font-bold">Tags</h1>
          </div>
          {isAuthenticated && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={onOpen}
            >
              Add Tags
            </Button>
          )}
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Table
            aria-label="Tags table"
            isHeaderSticky
            classNames={{
              wrapper: "max-h-[600px]",
            }}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>POST COUNT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              loadingContent={<div>Loading tags...</div>}
            >
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TagIcon size={16} className="text-primary" />
                      {tag.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText size={14} className="text-default-400" />
                      {tag.postCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <Tooltip
                        content={
                          tag.postCount
                            ? "Cannot delete tag with existing posts"
                            : "Delete tag"
                        }
                      >
                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(tag)}
                          isDisabled={
                            tag?.postCount ? tag.postCount > 0 : false
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <Tags size={20} />
            Add Tags
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Enter tags"
                placeholder="Type and press Enter or comma to add tags"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setValidationError(null); // Clear error when user types
                }}
                onKeyDown={handleTagInputKeyDown}
                isInvalid={!!validationError}
                errorMessage={validationError || undefined}
                startContent={<TagIcon size={16} className="text-default-400" />}
              />
              <div className="flex flex-wrap gap-2">
                {newTags.map((tag) => (
                  <Chip
                    key={tag}
                    onClose={() => handleRemoveNewTag(tag)}
                    variant="flat"
                    endContent={<X size={14} />}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddTags}
              isLoading={isSubmitting}
              isDisabled={newTags.length === 0}
            >
              Add Tags
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagsPage;
