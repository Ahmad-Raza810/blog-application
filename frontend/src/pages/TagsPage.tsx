import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Chip } from '@nextui-org/react';
import { Tag as TagIcon, Search, Hash } from 'lucide-react';
import { apiService, Tag, extractErrorMessage } from '../services/apiService';
import { motion } from 'framer-motion';
import { pageVariants, container, item } from '../utils/animation-utils';

interface TagsPageProps {
  isAuthenticated?: boolean;
}

const TagsPage: React.FC<TagsPageProps> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTags();
        setTags(data);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load tags'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            Browse Tags
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Find posts by specific keywords and topics
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search tags..."
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
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-10 w-24 animate-pulse bg-default-100 rounded-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/30 shadow-lg p-6">
          <CardBody>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTags.map((tag) => (
                <motion.div key={tag.id} variants={item}>
                  <Chip
                    variant="flat"
                    classNames={{
                      base: "h-auto py-2 px-4 bg-white dark:bg-slate-700 hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 border border-slate-200 dark:border-slate-600",
                      content: "flex items-center gap-2 text-base font-medium"
                    }}
                  >
                    <Hash size={14} />
                    {tag.name}
                    <span className="text-xs opacity-70 ml-1">({tag.postCount})</span>
                  </Chip>
                </motion.div>
              ))}
            </motion.div>
          </CardBody>
        </Card>
      )}
    </motion.div>
  );
};

export default TagsPage;
