import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { apiService, Post, Category, Tag as TagType, extractErrorMessage } from '../services/apiService';
import PostList from '../components/PostList';
import { pageVariants } from '../utils/animation-utils';

const BlogsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt,desc");
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
    const [selectedTag, setSelectedTag] = useState<string | undefined>(searchParams.get('tag') || undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
                    apiService.getPosts({
                        categoryId: selectedCategory != undefined ? selectedCategory : undefined,
                        tagId: selectedTag || undefined
                    }),
                    apiService.getCategories(),
                    apiService.getTags()
                ]);

                setPosts(postsResponse);
                setCategories(categoriesResponse);
                setTags(tagsResponse);
                setError(null);
            } catch (err) {
                setError(extractErrorMessage(err, 'Failed to load content. Please try again later.'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, sortBy, selectedCategory, selectedTag]);

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12 pt-8"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">All Blogs</h1>
                    <p className="text-secondary-600 dark:text-secondary-400">Explore our latest stories, ideas, and updates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2/3 width */}
                <div className="lg:col-span-2">
                    {/* Categories Tabs as Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory(undefined)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === undefined
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <PostList
                        posts={posts}
                        loading={loading}
                        error={error}
                        page={page}
                        sortBy={sortBy}
                        onPageChange={setPage}
                        onSortChange={setSortBy}
                    />
                </div>

                {/* Sidebar - 1/3 width */}
                <aside className="space-y-8">
                    {/* Search Widget */}
                    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-100 dark:border-secondary-700">
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-4">Search</h3>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Popular Tags */}
                    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-100 dark:border-secondary-700">
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-4">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => setSelectedTag(selectedTag === tag.id ? undefined : tag.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTag === tag.id
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                        : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                                        }`}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Widget */}
                    <div className="bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Weekly Newsletter</h3>
                        <p className="text-white/80 text-sm mb-4">Get the best articles delivered to your inbox every week.</p>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white mb-3"
                        />
                        <Button className="w-full bg-white text-primary-600 hover:bg-white/90 border-none font-semibold">
                            Subscribe
                        </Button>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
};

export default BlogsPage;
