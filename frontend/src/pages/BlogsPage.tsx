import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Chip, Spinner, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { pageVariants } from '../utils/animation-utils';

// Memoized Post Card Component to prevent unnecessary re-renders
const BlogCard = React.memo(({ post, index }: { post: Post; index: number }) => {
    // Memoize the expensive regex operation
    const excerpt = React.useMemo(() => {
        return post.content.replace(/<[^>]*>/g, '').substring(0, 250) + '...';
    }, [post.content]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 10) * 0.05 }}
        >
            <Link to={`/posts/${post.id}`}>
                <Card
                    isPressable
                    className="w-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                    <CardBody className="p-0">
                        <div className="grid md:grid-cols-3 gap-0">
                            {/* Image */}
                            <div className="md:col-span-1 h-72 md:h-auto overflow-hidden">
                                <img
                                    src={(post as any).coverImage || `https://source.unsplash.com/random/800x600?${post.category?.name || 'blog'}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2 p-8 flex flex-col justify-between">
                                <div>
                                    {/* Category */}
                                    {post.category && (
                                        <Chip
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            className="mb-4"
                                        >
                                            {post.category.name}
                                        </Chip>
                                    )}

                                    {/* Title */}
                                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-base text-secondary-600 dark:text-secondary-400 mb-6 line-clamp-3 leading-relaxed">
                                        {excerpt}
                                    </p>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{post.author?.name || 'Anonymous'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Link>
        </motion.div>
    );
});

const BlogsPage: React.FC = () => {
    // ... (rest of the component)
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Fetch posts with pagination
    const fetchPosts = async (currentCursor: string | null = null, append = false) => {
        try {
            if (!currentCursor && !append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await apiService.getPosts({
                categoryId: undefined,
                tagId: undefined,
                cursor: currentCursor || undefined,
                pageSize: 10 // Adjust pageSize as needed
            });

            if (response.posts) {
                setPosts(prev => append ? [...prev, ...response.posts] : response.posts);
                setCursor(response.cursor);
                setHasMore(response.hasMore);
            } else {
                if (!append) setPosts([]);
                setHasMore(false);
            }
            setError(null);
        } catch (err) {
            setError(extractErrorMessage(err, 'Failed to load blogs. Please try again later.'));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchPosts(null, false);
    }, []);

    // Handle Load More button click
    const handleLoadMore = () => {
        if (!loadingMore && hasMore && cursor) {
            fetchPosts(cursor, true);
        }
    };

    return (
        <motion.div
            className="min-h-screen py-8"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            {/* Blog Posts - Centered and Larger */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading && posts.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-secondary-600 dark:text-secondary-400">No blogs found.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center py-8">
                                <Button
                                    size="lg"
                                    color="primary"
                                    variant="shadow"
                                    onClick={handleLoadMore}
                                    isLoading={loadingMore}
                                    className="px-12 font-semibold"
                                >
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </Button>
                            </div>
                        )}

                        {/* No More Posts */}
                        {!hasMore && posts.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-secondary-500 dark:text-secondary-400 text-lg">
                                    You've reached the end! 🎉
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BlogsPage;
