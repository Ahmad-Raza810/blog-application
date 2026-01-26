import React from 'react';
import { Pagination } from '@nextui-org/react';
import { Calendar, Clock, CornerDownRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../services/apiService';
import { motion } from 'framer-motion';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (newPage: number) => void;
  onSortChange: (newSort: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
  page,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-secondary-800 rounded-2xl h-64 w-full border border-secondary-200 dark:border-secondary-700"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-dashed border-secondary-300 dark:border-secondary-700">
        <div className="bg-secondary-100 dark:bg-secondary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CornerDownRight className="text-secondary-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">No posts found</h3>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-sm mx-auto">
          We couldn't find any articles matching your criteria. Try different filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-secondary-200 dark:border-secondary-800">
        <span className="text-sm text-secondary-500 dark:text-secondary-400">
          Showing {posts.length} articles
        </span>
      </div>

      <div className="grid gap-8">
        {posts.map((post, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={post.id}
          >
            <Link to={`/posts/${post.id}`}>
              <article className="group bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-full md:h-72">
                {/* Image Section */}
                <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden">
                  <img
                    src={post.coverImageUrl || `https://source.unsplash.com/random/800x600?${post.category?.name || 'tech'}`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-secondary-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 shadow-sm border border-secondary-100 dark:border-secondary-700">
                      {post.category?.name || 'Article'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>5 min read</span>
                      </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-secondary-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-4 leading-relaxed">
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center overflow-hidden">
                        {/* Placeholder for avatar if not available on post author object immediately, or use User icon */}
                        <User size={16} className="text-secondary-500" />
                      </div>
                      <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {post.author?.name}
                      </span>
                    </div>


                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Pagination
          total={10}
          page={page}
          onChange={onPageChange}
          color="primary"
          size="lg"
          showControls
          className="gap-2"
          radius="full"
          classNames={{
            cursor: "bg-gradient-primary shadow-lg",
          }}
        />
      </div>
    </div>
  );
};

export default PostList;