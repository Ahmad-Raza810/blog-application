import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@nextui-org/react';
import { BookOpen, Search, ArrowRight, Sparkles } from 'lucide-react';
import { apiService, Category, extractErrorMessage } from '../services/apiService';
import { motion } from 'framer-motion';
import { pageVariants, container, item } from '../utils/animation-utils';

interface CategoriesPageProps {
  isAuthenticated?: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load categories'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
            Explore Categories
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Discover content by topic and find what interests you most
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search categories..."
            startContent={<Search size={18} className="text-default-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            variant="bordered"
            radius="full"
            classNames={{
              inputWrapper: "bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-default-100 border-none shadow-none" radius="lg">
              <div className="h-full w-full bg-default-200" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredCategories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Card
                className="group h-full border-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                isPressable
              >
                <CardBody className="p-6 flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />

                  <div className="relative z-10">
                    <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-default-500 font-medium">
                      {category.postCount} {category.postCount === 1 ? 'Post' : 'Posts'}
                    </p>
                  </div>

                  <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-primary">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoriesPage;
