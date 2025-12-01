import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from '@nextui-org/react';
import { ArrowLeft, FileText, AlertCircle, Edit, Plus } from 'lucide-react';
import { apiService, Post, Category, Tag, PostStatus, extractErrorMessage, extractValidationErrors } from '../services/apiService';
import PostForm from '../components/PostForm';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags()
        ]);

        setCategories(categoriesResponse);
        setTags(tagsResponse);

        if (id) {
          const postResponse = await apiService.getPost(id);
          setPost(postResponse);
        }

        setError(null);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load necessary data. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (postData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
    status: PostStatus;
  }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setValidationErrors({});

      if (id) {
        await apiService.updatePost({
          ...postData,
          id
        });
      } else {
        await apiService.createPost(postData);
      }

      navigate('/');
    } catch (err) {
      const backendErrors = extractValidationErrors(err);
      if (Object.keys(backendErrors).length > 0) {
        // Map backend field names to form field names
        // Backend uses field names from DTO (title, content, categoryId, tagIds, status)
        const mappedErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach(key => {
          // Map backend field names to form field names
          // Backend: categoryId -> Form: category
          if (key === 'categoryId') {
            mappedErrors.category = backendErrors[key];
          } else {
            // For other fields (title, content, tagIds, status), use as-is or lowercase
            mappedErrors[key.toLowerCase()] = backendErrors[key];
          }
        });
        setValidationErrors(mappedErrors);
      } else {
        // If no validation errors, show general error message
        setError(extractErrorMessage(err, 'Failed to save the post. Please try again.'));
      }
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full animate-pulse">
          <CardBody>
            <div className="h-8 bg-default-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-2/3"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              onClick={handleCancel}
            >
              Back
            </Button>
            <div className="flex items-center gap-2">
              {id ? <Edit size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />}
              <h1 className="text-2xl font-bold">
                {id ? 'Edit Post' : 'Create New Post'}
              </h1>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <PostForm
            initialPost={post}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={categories}
            availableTags={tags}
            isSubmitting={isSubmitting}
            backendErrors={validationErrors}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPostPage;