import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
} from '@nextui-org/react';
import { BookOpen, Tag, Grid3x3, AlertCircle, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService, Post, Category, Tag as TagType, extractErrorMessage } from '../services/apiService';
import PostList from '../components/PostList';
import { pageVariants, fadeIn } from '../utils/animation-utils';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

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

  const handleCategoryChange = (categoryId: string | undefined) => {
    if ("all" === categoryId) {
      setSelectedCategory(undefined)
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 space-y-6"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16 text-white shadow-2xl mb-12"
        variants={fadeIn}
      >
        <div className="relative z-10 max-w-3xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
              <Sparkles className="animate-pulse text-yellow-300" size={28} />
            </div>
            <span className="font-medium tracking-wide uppercase text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
              Welcome to the Future
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Stories</span> that Matter
          </h1>

          <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed mb-8 text-blue-50">
            A curated space for developers, designers, and creators to share knowledge,
            explore ideas, and connect with a global community.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-white text-accent-1 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Start Reading
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300">
              Join Community
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-pulse" />
      </motion.div>

      <Card className="mb-6 px-2 hover-lift glass-card border-none">
        <CardHeader className="flex items-center gap-2">
          <BookOpen className="text-primary" size={24} />
          <h1 className="text-2xl font-bold">Blog Posts</h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Tabs
              selectedKey={selectedCategory}
              onSelectionChange={(key) => {
                handleCategoryChange(key as string)
              }}
              variant="underlined"
              classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-primary",
              }}
            >
              <Tab
                key="all"
                title={
                  <div className="flex items-center gap-2">
                    <Grid3x3 size={16} />
                    <span>All Posts</span>
                  </div>
                }
              />
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  title={
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{category.name} ({category.postCount})</span>
                    </div>
                  }
                />
              ))}
            </Tabs>

            {tags.length > 0 && (
              <motion.div
                className="flex items-center gap-2 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Filter size={16} className="text-default-500" />
                <span className="text-sm text-default-600">Filter by tags:</span>
                {tags.map((tag, index) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => setSelectedTag(selectedTag == tag.id ? undefined : tag.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${selectedTag === tag.id
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'bg-default-100 hover:bg-default-200 text-default-700'
                      }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tag size={14} />
                    {tag.name} ({tag.postCount})
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </CardBody>
      </Card>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        page={page}
        sortBy={sortBy}
        onPageChange={setPage}
        onSortChange={setSortBy}
      />
    </motion.div>
  );
};

export default HomePage;