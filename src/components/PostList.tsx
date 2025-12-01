import React from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Chip, Pagination, Select, SelectItem } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Post } from '../services/apiService';
import { Calendar, Clock, Tag, FileText, User, AlertCircle, BookOpen } from 'lucide-react';
import DOMPurify from 'dompurify';
import { staggerContainer, staggerItem } from '../utils/animation-utils';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
  page,
  sortBy,
  onPageChange,
  onSortChange,
}) => {

  const navigate = useNavigate();

  const sortOptions = [
    { value: "createdAt,desc", label: "Newest First" },
    { value: "createdAt,asc", label: "Oldest First" },
    { value: "title,asc", label: "Title A-Z" },
    { value: "title,desc", label: "Title Z-A" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createSanitizedHTML = (content: string) => {
    return {
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
        ALLOWED_ATTR: []
      })
    };
  };

  const createExcerpt = (content: string) => {
    // First sanitize the HTML
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
      ALLOWED_ATTR: []
    });

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedContent;

    // Get the text content and limit it
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    textContent = textContent.trim();

    // Limit to roughly 200 characters, ending at the last complete word
    if (textContent.length > 200) {
      textContent = textContent.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
    }

    return textContent;
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const navToPostPage = (post: Post) => {
    navigate(`/posts/${post.id}`)
  }

  return (
    <div className="w-full space-y-6">
      {/* <div className="flex justify-end mb-4">
        <Select
          label="Sort by"
          selectedKeys={[sortBy]}
          className="max-w-xs"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div> */}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardBody>
                <div className="space-y-3">
                  <div className="h-6 bg-default-200 rounded w-3/4 shimmer"></div>
                  <div className="h-4 bg-default-200 rounded w-1/2 shimmer"></div>
                  <div className="h-4 bg-default-200 rounded w-full shimmer"></div>
                  <div className="h-4 bg-default-200 rounded w-5/6 shimmer"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {!posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-default-100 rounded-full">
                  <BookOpen size={48} className="text-default-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-default-700">No posts found</h3>
                  <p className="text-sm text-default-500 mt-1">Try adjusting your filters or check back later.</p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={staggerItem}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="w-full p-2 cursor-pointer transition-shadow"
                    isPressable={true}
                    onPress={() => navToPostPage(post)}
                  >
                    <CardHeader className="flex gap-3">
                      <div className='flex flex-col flex-1'>
                        <div className="flex items-start gap-2">
                          <FileText size={20} className="text-accent-1 mt-1 flex-shrink-0" />
                          <h2 className="text-xl font-bold text-left font-display">
                            {post.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <User size={14} className="text-default-400" />
                          <p className="text-small text-default-500">
                            by {post.author?.name || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="line-clamp-3">
                        {createExcerpt(post.content)}
                      </p>
                    </CardBody>
                    <CardFooter className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1 text-small text-default-500">
                        <Calendar size={16} className="text-default-400" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1 text-small text-default-500">
                        <Clock size={16} className="text-default-400" />
                        {post.readingTime || 1} min read
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Chip
                          className="bg-gradient-primary text-white"
                          startContent={<BookOpen size={12} />}
                          size="sm"
                        >
                          {post.category.name}
                        </Chip>
                        {post.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            className="bg-default-100"
                            startContent={<Tag size={12} />}
                            size="sm"
                          >
                            {tag.name}
                          </Chip>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* {posts && posts.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={posts.totalPages}
                page={page}
                onChange={onPageChange}
                showControls
              />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default PostList;