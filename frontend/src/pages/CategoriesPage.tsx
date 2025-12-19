import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { BookOpen, Search, ArrowRight, Sparkles, Hash, TrendingUp, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { apiService, Category, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, container, item } from '../utils/animation-utils';

interface CategoriesPageProps {
  isAuthenticated?: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.userRole === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Category State
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateChange } = useDisclosure();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete Category State
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (onClose: () => void) => {
    // Backend Validation Rules
    // 1. NotBlank
    if (!newCategoryName.trim()) {
      setCreateError("Name is required.");
      return;
    }
    // 2. Size(min = 2, max = 50)
    if (newCategoryName.length < 2 || newCategoryName.length > 50) {
      setCreateError("Length of name should be between 2 and 50 characters.");
      return;
    }
    // 3. Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$")
    if (!/^[a-zA-Z0-9\-\s]+$/.test(newCategoryName)) {
      setCreateError("Only letters, numbers, spaces and hyphens are allowed");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const newCategory = await apiService.createCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      onClose();
    } catch (err) {
      setCreateError(extractErrorMessage(err, 'Failed to create category'));
    } finally {
      setCreating(false);
    }
  };

  const initiateDelete = (category: Category, e: React.MouseEvent) => {
    // Stop propagation to prevent Card press event
    e.stopPropagation();
    e.preventDefault();
    setCategoryToDelete(category);
    setDeleteError(null); // Clear previous errors
    onDeleteOpen();
  };

  const confirmDelete = async (onClose: () => void) => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      await apiService.deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      onClose();
    } catch (err) {
      // alert(extractErrorMessage(err, 'Failed to delete category')); // Removed alert
      setDeleteError(extractErrorMessage(err, 'Failed to delete category'));
    } finally {
      setDeleting(false);
      // setCategoryToDelete(null); // Keep category selected in case of error retry, close will clear it via onClose or we handle it
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Background decoration bubbles
  const BackgroundDecoration = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl opacity-30" />
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <BackgroundDecoration />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 backdrop-blur-sm">
                Explore Content
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
            >
              Discover Categories <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                That Spark Interest
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl"
            >
              Browse through our curated collection of topics. From technology to lifestyle, find the content that matters to you.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full md:w-80 flex flex-col gap-4"
          >
            <Input
              placeholder="Search categories..."
              startContent={<Search size={18} className="text-slate-400" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              classNames={{
                base: "h-12",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full bg-white/30 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm ring-0"
              }}
              radius="lg"
            />
            {isAdmin && (
              <Button
                endContent={<Plus size={18} />}
                className="w-full bg-primary-600 text-white shadow-lg shadow-primary/20"
                onPress={onCreateOpen}
              >
                Create Category
              </Button>
            )}
          </motion.div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-white/30 dark:bg-slate-800/60 border border-white/20 shadow-none" radius="lg">
                <div className="h-full w-full bg-default-200/50" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 backdrop-blur-sm">
            <p className="text-red-500 font-medium text-lg mb-2">Oops! Something went wrong</p>
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No categories found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredCategories.map((category, index) => {
              const gradients = [
                "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
                "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
                "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
                "from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400",
                "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400",
                "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400",
              ];
              const style = gradients[index % gradients.length];
              const [bgGradient, textColor] = [style.split(" text-")[0], "text-" + style.split(" text-")[1]];

              return (
                <motion.div key={category.id} variants={item}>
                  <Card
                    className="group h-full border border-white/20 dark:border-slate-700/60 bg-white/30 dark:bg-slate-800/70 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                    isPressable
                    onPress={() => navigate(`/?category=${category.id}`)}
                    radius="lg"
                  >
                    <CardBody className="p-6 h-full relative cursor-pointer">
                      {/* Decorative gradient overlay */}
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${bgGradient} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`} />

                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgGradient} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                            <BookOpen className={`w-7 h-7 ${textColor}`} />
                          </div>

                          <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            {isAdmin && (
                              <div
                                onClick={(e) => initiateDelete(category, e)}
                                onMouseDown={(e) => e.stopPropagation()} // Extra safety against press events
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500 z-20 cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 size={20} />
                              </div>
                            )}
                          </div>

                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                            Discover latest articles and insights about {category.name}.
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-slate-200 dark:group-hover:border-slate-600/50 transition-colors">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <span className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <Hash size={14} />
                            </span>
                            <span className="font-medium text-sm">
                              {category.postCount} {category.postCount === 1 ? 'Article' : 'Articles'}
                            </span>
                          </div>

                          <div className={`p-2 rounded-full bg-slate-50 dark:bg-slate-800 ${textColor} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Create Category Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateChange} backdrop="blur" classNames={{
        base: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl",
        header: "border-b border-slate-200 dark:border-slate-800",
        footer: "border-t border-slate-200 dark:border-slate-800",
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-slate-800 dark:text-white">Create New Category</ModalHeader>
              <ModalBody className="py-6">
                <Input
                  autoFocus
                  label="Category Name"
                  placeholder="Enter category name"
                  variant="bordered"
                  value={newCategoryName}
                  onValueChange={setNewCategoryName}
                />
                {createError && (
                  <p className="text-red-500 text-sm mt-2">{createError}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleCreateCategory(onClose)}
                  isLoading={creating}
                  isDisabled={!newCategoryName.trim()}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteChange} backdrop="blur" classNames={{
        base: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl",
        header: "border-b border-slate-200 dark:border-slate-800",
        footer: "border-t border-slate-200 dark:border-slate-800",
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-slate-800 dark:text-white">
                <AlertTriangle className="text-red-500" size={24} />
                Confirm Deletion
              </ModalHeader>
              <ModalBody className="py-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete the category <span className="font-bold text-slate-800 dark:text-slate-200">"{categoryToDelete?.name}"</span>?
                  This action cannot be undone.
                </p>
                {/* Error Message Display */}
                {deleteError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>{deleteError}</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => confirmDelete(onClose)}
                  isLoading={deleting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
