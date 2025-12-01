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
  Tooltip,
} from "@nextui-org/react";
import { Plus, Edit2, Trash2, FolderTree, BookOpen, AlertCircle, FileText } from "lucide-react";
import { apiService, Category, extractErrorMessage, extractValidationErrors } from "../services/apiService";

interface CategoriesPageProps {
  isAuthenticated: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null); // For validation errors in modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load categories. Please try again later."));
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFieldError(null); // Clear previous field errors
      setError(null); // Clear general error
      
      if (editingCategory) {
        await apiService.updateCategory(
          editingCategory.id,
          newCategoryName.trim()
        );
      } else {
        await apiService.createCategory(newCategoryName.trim());
      }
      await fetchCategories();
      handleModalClose();
    } catch (err) {
      const validationErrors = extractValidationErrors(err);
      
      // Check if there are field-specific validation errors
      if (Object.keys(validationErrors).length > 0) {
        // Display the specific field error (e.g., "name" field error)
        const nameError = validationErrors.name;
        if (nameError) {
          setFieldError(nameError);
        } else {
          // If there are other field errors, show them
          const firstError = Object.values(validationErrors)[0];
          setFieldError(firstError || 'Validation error occurred');
        }
      } else {
        // If no validation errors, show general error message
        setError(
          extractErrorMessage(
            err,
            `Failed to ${editingCategory ? "update" : "create"} category. Please try again.`
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${category.name}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteCategory(category.id);
      await fetchCategories();
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete category. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setFieldError(null); // Clear field errors when closing modal
    setError(null); // Clear general error
    onClose();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    onOpen();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onOpen();
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FolderTree className="text-primary" size={24} />
            <h1 className="text-2xl font-bold">Categories</h1>
          </div>
          {isAuthenticated && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={openAddModal}
            >
              Add Category
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
            aria-label="Categories table"
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
              loadingContent={<div>Loading categories...</div>}
            >
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText size={14} className="text-default-400" />
                      {category.postCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Tooltip
                          content={
                            category.postCount
                              ? "Cannot delete category with existing posts"
                              : "Delete category"
                          }
                        >
                          <Button
                            isIconOnly
                            variant="flat"
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(category)}
                            isDisabled={
                              category?.postCount
                                ? category.postCount > 0
                                : false
                            }
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
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
            <FolderTree size={20} />
            {editingCategory ? "Edit Category" : "Add Category"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Category Name"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setFieldError(null); // Clear error when user types
              }}
              isRequired
              isInvalid={!!fieldError}
              errorMessage={fieldError || undefined}
              startContent={<BookOpen size={16} className="text-default-400" />}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddEdit}
              isLoading={isSubmitting}
            >
              {editingCategory ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
