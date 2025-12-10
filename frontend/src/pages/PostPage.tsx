import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { Button, Chip, User, Divider, Card, CardBody } from '@nextui-org/react';
import { Edit, Trash2, Calendar, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { pageVariants, fadeIn } from '../utils/animation-utils';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const data = await apiService.getPost(id);
          setPost(data);
        }
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load post'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (id) {
          await apiService.deletePost(id);
          navigate('/');
        }
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="h-8 w-32 bg-default-200 rounded-full" />
        <div className="h-12 w-3/4 bg-default-200 rounded-lg" />
        <div className="h-64 w-full bg-default-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-default-200 rounded" />
          <div className="h-4 w-full bg-default-200 rounded" />
          <div className="h-4 w-2/3 bg-default-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Post not found</h2>
        <Button as={Link} to="/" color="primary" variant="flat" startContent={<ArrowLeft size={18} />}>
          Back to Home
        </Button>
      </div>
    );
  }

  const isAuthor = user && user.email === post.author.email;

  return (
    <motion.article
      className="max-w-4xl mx-auto px-4 pb-20"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-8">
        <Button
          as={Link}
          to="/"
          variant="light"
          startContent={<ArrowLeft size={18} />}
          className="text-slate-600 hover:text-primary font-medium"
        >
          Back to Home
        </Button>
        <div className="flex gap-2">
          <Button isIconOnly variant="flat" className="bg-white dark:bg-slate-800 text-slate-600">
            <Share2 size={18} />
          </Button>
          <Button isIconOnly variant="flat" className="bg-white dark:bg-slate-800 text-slate-600">
            <Bookmark size={18} />
          </Button>
        </div>
      </div>

      {/* Header Section */}
      <motion.header className="mb-10" variants={fadeIn}>
        <div className="flex flex-wrap gap-2 mb-6">
          <Chip color="primary" variant="flat" className="font-medium">
            {post.category.name}
          </Chip>
          {post.tags.map(tag => (
            <Chip key={tag.id} variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-600">
              #{tag.name}
            </Chip>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6 text-slate-900 dark:text-white">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-200 dark:border-slate-800">
          <User
            name={post.author.name}
            description="Author"
            avatarProps={{
              src: `https://i.pravatar.cc/150?u=${post.author.id}`,
              isBordered: true,
              color: "primary"
            }}
            classNames={{
              name: "text-lg font-semibold",
              description: "text-primary font-medium"
            }}
          />

          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.div
          className="mb-10 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </motion.div>
      )}

      {/* Content */}
      <Card className="glass-panel border-none mb-10">
        <CardBody className="p-8 md:p-12">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </CardBody>
      </Card>

      {/* Author Actions */}
      {isAuthor && (
        <motion.div
          className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            as={Link}
            to={`/posts/${post.id}/edit`}
            color="primary"
            variant="flat"
            startContent={<Edit size={18} />}
          >
            Edit Post
          </Button>
          <Button
            color="danger"
            variant="flat"
            startContent={<Trash2 size={18} />}
            onPress={handleDelete}
          >
            Delete Post
          </Button>
        </motion.div>
      )}
    </motion.article>
  );
};

export default PostPage;