import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { apiService, Post, Category, Tag as TagType, extractErrorMessage } from '../services/apiService';
import PostList from '../components/PostList';
import { pageVariants, fadeIn } from '../utils/animation-utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage: React.FC = () => {
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

  const featuredPosts = posts ? posts.slice(0, 3) : [];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16 text-white shadow-2xl"
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
              Welcome to ContentHub
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Ideas</span> & Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white">Story</span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed mb-8 text-blue-50">
            A community of writers, developers, and creators sharing knowledge and perspectives.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/posts/new">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 border-none shadow-xl font-semibold">
                Start Writing
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="bordered" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold">
                Explore Categories
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </motion.div>

      {/* Featured Carousel */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary-500" />
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Trending Now</h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {featuredPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Link to={`/posts/${post.id}`}>
                  <div className="group relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer">
                    <img
                      src={(post as any).coverImage || `https://source.unsplash.com/random/800x600?${post.category?.name || 'blog'}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                      <span className="text-xs font-semibold text-accent-green bg-accent-green/20 backdrop-blur-sm px-2 py-1 rounded-md w-fit mb-2 border border-accent-green/30">
                        {post.category?.name || 'General'}
                      </span>
                      <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-primary-300 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <span>{post.author?.name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Latest Posts</h2>
            <div className="flex gap-2">
              {/* Sort controls could go here */}
            </div>
          </div>

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

export default HomePage;