import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader,
  CardBody,
  Button,
} from '@nextui-org/react';
import { Plus, BookDashed, AlertCircle, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import PostList from '../components/PostList';

const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt,desc");

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrafts({
          page: page - 1,
          size: 10,
          sort: sortBy,
        });
        setDrafts(response);
        setError(null);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load drafts. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [page, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookDashed className="text-primary" size={24} />
            <h1 className="text-2xl font-bold">My Drafts</h1>
          </div>
          <Button
            as={Link}
            to="/posts/new"
            color="primary"
            startContent={<Plus size={16} />}
          >
            New Post
          </Button>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <PostList
            posts={drafts}
            loading={loading}
            error={error}
            page={page}
            sortBy={sortBy}
            onPageChange={setPage}
            onSortChange={setSortBy}
          />

          {drafts?.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-default-100 rounded-full">
                  <Edit3 size={48} className="text-default-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-default-700">No draft posts yet</h3>
                  <p className="text-sm text-default-500 mt-1">Start writing your first post!</p>
                </div>
                <Button
                  as={Link}
                  to="/posts/new"
                  color="primary"
                  variant="flat"
                  className="mt-2"
                  startContent={<Plus size={16} />}
                >
                  Create Your First Post
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DraftsPage;