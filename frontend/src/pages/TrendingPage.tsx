import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { pageVariants, container, item } from '../utils/animation-utils';

const TrendingPage: React.FC = () => {
    const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                const data = await apiService.getTrendingPosts();
                setTrendingPosts(data);
            } catch (err) {
                setError(extractErrorMessage(err, 'Failed to load trending posts'));
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                >
                    <TrendingUp size={20} />
                    <span className="font-bold text-sm uppercase tracking-wide">Trending Now</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 dark:text-white mb-6">
                    Most Popular Stories
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400">
                    Discover what everyone is reading. The most engaging and discussed articles on ContentHub right now.
                </p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="h-40 w-full bg-secondary-100 dark:bg-secondary-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <Button color="primary" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            ) : trendingPosts.length === 0 ? (
                <div className="text-center py-20 text-secondary-500">
                    <p className="text-xl">No trending posts found at the moment.</p>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    className="space-y-8"
                >
                    {trendingPosts.map((post, index) => (
                        <motion.div key={post.id} variants={item}>
                            <Link to={`/posts/${post.id}`} className="group block">
                                <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start p-6 rounded-3xl bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 hover:border-primary-100 dark:hover:border-primary-900/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                    {/* Rank Number - Desktop (Left) */}
                                    <div className="hidden md:flex flex-col justify-center items-center w-16 flex-shrink-0 self-stretch border-r border-secondary-100 dark:border-secondary-800 pr-6">
                                        <span className={`text-5xl font-display font-bold ${index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-500' :
                                            index === 1 ? 'text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-500' :
                                                index === 2 ? 'text-transparent bg-clip-text bg-gradient-to-br from-amber-600 to-amber-800' :
                                                    'text-secondary-200 dark:text-secondary-700'
                                            }`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Image */}
                                    <div className="w-full md:w-64 h-48 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                        <img
                                            src={post.coverImageUrl || `https://source.unsplash.com/random/800x600?${post.category?.name || 'trending'}&sig=${index}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Rank Number - Mobile (Overlay) */}
                                        <div className="absolute top-2 left-2 md:hidden">
                                            <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur flex items-center justify-center font-bold text-lg shadow-lg">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 py-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {post.category?.name || 'Article'}
                                            </span>
                                            <span className="text-xs text-secondary-400 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-3 leading-tight group-hover:text-primary-600 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-4">
                                            {post.content.replace(/<[^>]*>/g, '')}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-100 to-accent-purple/20 flex items-center justify-center text-primary-700 font-bold text-[10px]">
                                                {post.author?.name.charAt(0) || <User size={10} />}
                                            </div>
                                            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                                {post.author?.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="hidden md:flex self-center px-4">
                                        <div className="w-12 h-12 rounded-full border border-secondary-200 dark:border-secondary-700 flex items-center justify-center text-secondary-400 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all scale-90 group-hover:scale-100">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TrendingPage;
