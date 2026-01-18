import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { Button, Chip, Avatar } from '@nextui-org/react';
import { Edit, Trash2, Calendar, Clock, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { pageVariants, fadeIn } from '../utils/animation-utils';
import CommentsSection from '../components/CommentsSection';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showComments, setShowComments] = useState(location.hash === '#comments');

  // Handle hash change or initial load with hash
  useEffect(() => {
    if (location.hash === '#comments') {
      setShowComments(true);
      // Optional: scroll into view if not handled automatically
      setTimeout(() => {
        const commentsElement = document.getElementById('comments');
        if (commentsElement) {
          commentsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

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
        <div className="h-8 w-32 bg-secondary-200 dark:bg-secondary-800 rounded-full" />
        <div className="h-12 w-3/4 bg-secondary-200 dark:bg-secondary-800 rounded-lg" />
        <div className="h-64 w-full bg-secondary-200 dark:bg-secondary-800 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-secondary-200 dark:bg-secondary-800 rounded" />
          <div className="h-4 w-full bg-secondary-200 dark:bg-secondary-800 rounded" />
          <div className="h-4 w-2/3 bg-secondary-200 dark:bg-secondary-800 rounded" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Post not found</h2>
        <Button as={Link} to="/blogs" color="primary" variant="flat" startContent={<ArrowLeft size={18} />}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  const isAuthor = user && post.author && user.id === post.author.id;

  return (
    <motion.article
      className="max-w-4xl mx-auto px-4 pb-20 pt-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* 1. Top Row: Back and Share */}
      <div className="flex justify-between items-center mb-8">
        <Button
          onPress={() => navigate(-1)}
          variant="light"
          startContent={<ArrowLeft size={18} />}
          className="text-secondary-600 dark:text-secondary-400 hover:text-primary font-medium"
        >
          Back
        </Button>
        <Button isIconOnly variant="light" className="text-secondary-600 dark:text-secondary-400">
          <Share2 size={20} />
        </Button>
      </div>

      {/* 2. Header Section: Title -> Category/Tags -> Meta */}
      <motion.header className="mb-10 text-center" variants={fadeIn}>
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-secondary-900 dark:text-white">
          {post.title}
        </h1>

        {/* Category & Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Chip color="primary" variant="shadow" className="font-medium">
            {post.category.name}
          </Chip>
          {post.tags.map(tag => (
            <Chip key={tag.id} variant="flat" className="bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400">
              #{tag.name}
            </Chip>
          ))}
        </div>

        {/* 3. Author/Meta */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-secondary-500 py-6 border-y border-secondary-100 dark:border-secondary-800">
          <div className="flex items-center gap-3">
            <Avatar src={`https://i.pravatar.cc/150?u=${post.author?.id}`} size="sm" isBordered color="primary" />
            <div className="text-left">
              <p className="text-sm font-bold text-secondary-900 dark:text-white">{post.author?.name || 'Unknown Author'}</p>
              <p className="text-xs">Author</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-secondary-200 dark:bg-secondary-800"></div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="text-sm font-medium">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm font-medium">{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cover Image */}
      
      {post.coverImage && (
        <motion.div
          className="mb-12 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-secondary-900/5 aspect-video"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(() => {
            const coverSrc =
              post.coverImage.startsWith("http")
                ? post.coverImage
                : `http://localhost:8080${post.coverImage}`;

            return (
              <img
                src={coverSrc}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            );
          })()}
        </motion.div>
      )}


      {/* Main Content (No Sidebar) */}
      <div className="max-w-none mb-12">
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-secondary-900 dark:prose-headings:text-white prose-p:text-secondary-600 dark:prose-p:text-secondary-300 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-600 prose-img:rounded-2xl prose-img:shadow-lg mb-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex justify-end gap-3 py-6 border-t border-secondary-200 dark:border-secondary-800">
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
          </div>
        )}
      </div>

      {/* 4. Show Comments Button */}
      <div className="flex flex-col items-center gap-8 border-t border-secondary-200 dark:border-secondary-800 pt-10">
        {!showComments ? (
          <Button
            variant="shadow"
            color="primary"
            size="lg"
            startContent={<MessageCircle size={20} />}
            onPress={() => setShowComments(true)}
          >
            Show Comments
          </Button>
        ) : (
          <div className="w-full">
            <div className="flex justify-center mb-6">
              <Button
                variant="light"
                color="secondary"
                onPress={() => setShowComments(false)}
              >
                Hide Comments
              </Button>
            </div>
            <CommentsSection postId={post.id} />
          </div>
        )}
      </div>

    </motion.article>
  );
};

export default PostPage;