import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { Button, Chip, Textarea, Avatar } from '@nextui-org/react';
import { Edit, Trash2, Calendar, Clock, ArrowLeft, Share2, Bookmark, Heart, MessageCircle, Send, ThumbsUp } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(124); // Mock count
  const [commentText, setCommentText] = useState('');

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
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
        <Button as={Link} to="/" color="primary" variant="flat" startContent={<ArrowLeft size={18} />}>
          Back to Home
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
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-8 sticky top-20 z-10 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md p-4 rounded-xl border border-secondary-100 dark:border-secondary-800 shadow-sm">
        <Button
          as={Link}
          to="/"
          variant="light"
          startContent={<ArrowLeft size={18} />}
          className="text-secondary-600 dark:text-secondary-400 hover:text-primary font-medium"
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            className={`bg-secondary-50 dark:bg-secondary-800 ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-secondary-600'}`}
            onPress={handleLike}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </Button>
          <Button isIconOnly variant="flat" className="bg-secondary-50 dark:bg-secondary-800 text-secondary-600">
            <MessageCircle size={20} />
          </Button>
          <Button isIconOnly variant="flat" className="bg-secondary-50 dark:bg-secondary-800 text-secondary-600">
            <Bookmark size={20} />
          </Button>
          <Button isIconOnly variant="flat" className="bg-secondary-50 dark:bg-secondary-800 text-secondary-600">
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      {/* Header Section */}
      <motion.header className="mb-10 text-center" variants={fadeIn}>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Chip color="primary" variant="shadow" className="font-medium">
            {post.category.name}
          </Chip>
          {post.tags.map(tag => (
            <Chip key={tag.id} variant="flat" className="bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400">
              #{tag.name}
            </Chip>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-8 text-secondary-900 dark:text-white">
          {post.title}
        </h1>

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
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Actions (Left) */}
        <div className="hidden lg:flex flex-col gap-4 col-span-1 sticky top-32 h-fit">
          <div className="flex flex-col items-center gap-2 text-secondary-500">
            <Button isIconOnly radius="full" variant="light" className={isLiked ? "text-red-500" : ""} onPress={handleLike}>
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <span className="text-xs font-bold">{likeCount}</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-secondary-500">
            <Button isIconOnly radius="full" variant="light">
              <MessageCircle size={24} />
            </Button>
            <span className="text-xs font-bold">8</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-11">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-secondary-900 dark:prose-headings:text-white prose-p:text-secondary-600 dark:prose-p:text-secondary-300 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-600 prose-img:rounded-2xl prose-img:shadow-lg mb-12"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Author Actions */}
          {isAuthor && (
            <motion.div
              className="flex justify-end gap-3 py-6 border-t border-secondary-200 dark:border-secondary-800"
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

          {/* Comments Section */}
          <div className="mt-16 pt-10 border-t border-secondary-200 dark:border-secondary-800">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8">Comments (3)</h3>

            {/* Add Comment */}
            <div className="flex gap-4 mb-10">
              <Avatar src={user?.avatar} name={user?.name?.charAt(0)} className="flex-shrink-0" />
              <div className="flex-grow">
                <Textarea
                  placeholder="What are your thoughts?"
                  minRows={3}
                  value={commentText}
                  onValueChange={setCommentText}
                  className="mb-3"
                  variant="faded"
                />
                <Button color="primary" endContent={<Send size={16} />}>
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Mock Comments List */}
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Avatar src={`https://i.pravatar.cc/150?u=${i}`} className="flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-secondary-900 dark:text-white">Alex Johnson</span>
                      <span className="text-xs text-secondary-500">• 2 hours ago</span>
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-300 mb-2">
                      Great article! I really learned a lot from this. Especially the part about state management.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-xs text-secondary-500 hover:text-primary transition-colors">
                        <ThumbsUp size={14} /> 12 Likes
                      </button>
                      <button className="text-xs text-secondary-500 hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostPage;