import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Chip } from '@nextui-org/react';
import { Sparkles, TrendingUp, ArrowRight, BookOpen, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { apiService, Post, Category, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { pageVariants, fadeIn, item } from '../utils/animation-utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse, featuredResponse, trendingResponse] = await Promise.all([
          apiService.getPosts({}),
          apiService.getCategories(),
          apiService.getFeaturedPosts(),
          apiService.getTrendingPosts(),
        ]);

        setPosts(postsResponse.posts);
        setCategories(categoriesResponse);
        setFeaturedPosts(featuredResponse);
        setTrendingPosts(trendingResponse);
        setError(null);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load content.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived data
  const latestPosts = posts
    ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)
    : []; // First 6 recent posts
  const topCategories = categories.slice(0, 4); // First 4 categories

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* 1. Hero Section */}
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-gradient-hero py-20 px-8 md:px-16 text-white shadow-2xl text-center md:text-left"
        variants={fadeIn}
      >
        <div className="relative z-10 max-w-4xl mx-auto md:mx-0">
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium tracking-wide uppercase">Welcome to ContentHub</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Stories</span>,<br />
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">Knowledge</span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 max-w-2xl mb-10 leading-relaxed text-blue-50 mx-auto md:mx-0">
            A community where writers, developers, and thinkers gather to share perspectives on technology, life, and innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/blogs">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100 font-bold shadow-xl px-8 w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Reading
              </Button>
            </Link>
            {user && (
              <Link to="/posts/new">
                <Button size="lg" variant="bordered" className="border-2 border-white/40 text-white hover:bg-white/10 font-bold px-8 w-full sm:w-auto">
                  <PenTool className="w-5 h-5 mr-2" />
                  Write a Blog
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      </motion.section>

      {/* 2. Featured / Pinned Posts (Carousel) */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                <Sparkles size={24} />
              </div>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Featured Stories</h2>
            </div>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {featuredPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Link to={`/posts/${post.id}`}>
                  <Card className="h-[400px] w-full border-none shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="absolute inset-0">
                      <img
                        src={(post as any).coverImage || `https://source.unsplash.com/random/800x600?${post.category?.name || 'blog'}`}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    <CardFooter className="absolute bottom-0 z-10 flex-col items-start p-6 text-white border-t border-white/10 bg-black/20 backdrop-blur-sm">
                      <Chip size="sm" color="primary" variant="solid" className="mb-3 uppercase font-bold tracking-wider">
                        {post.category?.name || 'Featured'}
                      </Chip>
                      <h3 className="text-2xl font-bold mb-2 line-clamp-2 leading-tight group-hover:text-primary-300 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span>{post.author?.name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* 3. Top Categories Preview */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Explore Topics</h2>
          </div>
          <Link to="/categories">
            <Button variant="light" color="primary" className="font-semibold" endContent={<ArrowRight size={16} />}>
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topCategories.map((category, index) => (
            <Link key={category.id} to={`/categories?id=${category.id}`}>
              <Card
                isPressable
                className="w-full h-auto aspect-[4/3] bg-white dark:bg-secondary-800/50 border border-transparent hover:border-primary-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group overflow-visible"
              >
                <CardBody className="flex flex-col items-start justify-between p-6 h-full relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${index % 4 === 0 ? 'from-purple-500 to-blue-500' :
                    index % 4 === 1 ? 'from-pink-500 to-rose-500' :
                      index % 4 === 2 ? 'from-amber-400 to-orange-500' :
                        'from-emerald-400 to-teal-500'
                    } blur-xl group-hover:opacity-20 transition-opacity`} />

                  <div className={`p-3 rounded-2xl ${index % 4 === 0 ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                    index % 4 === 1 ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                      index % 4 === 2 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    } mb-4 group-hover:scale-110 transition-transform origin-left`}>
                    <BookOpen size={24} strokeWidth={2.5} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1 leading-tight group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary-500 font-medium">
                      <span>{category.postCount || 0} Articles</span>
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 4. Latest Posts (Limited View) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Latest Articles</h2>
            <Link to="/blogs" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-secondary-100 dark:divide-secondary-800">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-40 w-full bg-secondary-100 dark:bg-secondary-800 animate-pulse my-4 rounded-xl" />
              ))
            ) : latestPosts.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`}>
                <motion.div
                  variants={item}
                  className="group flex flex-col sm:flex-row gap-6 p-6 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={(post as any).coverImage || `https://source.unsplash.com/random/400x300?${post.category?.name || 'article'}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        {post.category?.name}
                      </span>
                      <span className="text-xs text-secondary-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Trending / Popular Sidebar */}
        <aside className="space-y-8">
          <div className="bg-white dark:bg-secondary-900 rounded-2xl p-6 shadow-sm border border-secondary-100 dark:border-secondary-800 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-rose-500" size={24} />
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Trending Now</h3>
            </div>

            <div className="space-y-6">
              {trendingPosts.map((post, index) => (
                <Link key={post.id} to={`/posts/${post.id}`} className="group flex gap-4 items-start">
                  <span className="text-3xl font-bold text-secondary-200 dark:text-secondary-700 leading-none -mt-1 group-hover:text-primary-200 transition-colors">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-secondary-900 dark:text-white leading-tight mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-secondary-500">
                      by {post.author?.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default HomePage;
