import React from 'react';
import { useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animation-utils';
import { Card, CardBody } from '@nextui-org/react';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Share your thoughts, ideas, and stories with the world
        </p>
      </div>

      <Card className="glass-panel border-none shadow-xl">
        <CardBody className="p-0">
          <PostForm postId={id} />
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default EditPostPage;