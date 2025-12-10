import React from 'react';
import { Card, CardBody, CardFooter, Chip, Button, Pagination, Image, User } from '@nextui-org/react';
import { Calendar, Clock, ArrowRight, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../services/apiService';
import { motion } from 'framer-motion';
import { container, item } from '../utils/animation-utils';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[400px] animate-pulse bg-default-100 border-none shadow-none" radius="lg">
            <div className="h-48 bg-default-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-default-200 rounded" />
              <div className="h-3 w-1/2 bg-default-200 rounded" />
              <div className="h-20 w-full bg-default-200 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-red-50 text-red-500 mb-4">
          <ArrowRight size={32} className="rotate-180" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-slate-500 max-w-md">{error}</p>
        <Button
          className="mt-6"
          color="primary"
          variant="flat"
          onPress={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="p-6 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-4">
          <Hash size={48} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No posts found</h3>
        <p className="text-slate-500 max-w-md">
          We couldn't find any posts matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <Card
              className="h-full border-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              isPressable
            >
              <Link to={`/posts/${post.id}`} className="h-full flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    removeWrapper
                    alt={post.title}
                    className="z-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    src={post.coverImage || `https://source.unsplash.com/random/800x600?${post.category.name}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <Chip
                      size="sm"
                      className="bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg"
                    >
                      {post.category.name}
                    </Chip>
                  </div>
                </div>

                <CardBody className="p-5 flex-grow">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-default-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag.id} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </CardBody>

                <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-default-100">
                  <div className="flex items-center gap-2">
                    <User
                      name={post.author.name}
                      description={new Date(post.createdAt).toLocaleDateString()}
                      avatarProps={{
                        src: `https://i.pravatar.cc/150?u=${post.author.id}`,
                        size: "sm",
                        isBordered: true,
                        color: "primary"
                      }}
                      classNames={{
                        name: "text-sm font-semibold",
                        description: "text-xs text-default-400"
                      }}
                    />
                  </div>
                  <div className="flex items-center text-default-400 text-xs gap-1">
                    <Clock size={14} />
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                  </div>
                </CardFooter>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>

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