import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input } from '@nextui-org/react';
import { Tag as TagIcon, Search } from 'lucide-react';
import { apiService, Tag, extractErrorMessage } from '../services/apiService';
import { motion } from 'framer-motion';
import { pageVariants, container, item } from '../utils/animation-utils';
import { useNavigate } from 'react-router-dom';

const TagsPage: React.FC = () => {
  const navigate = useNavigate();
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredTags.map((tag, index) => {
            // Generate a dynamic gradient based on index
            const gradients = [
              "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 group-hover:from-blue-500/30 group-hover:to-cyan-500/30",
              "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 group-hover:from-purple-500/30 group-hover:to-pink-500/30",
              "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 group-hover:from-amber-500/30 group-hover:to-orange-500/30",
              "from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 group-hover:from-green-500/30 group-hover:to-emerald-500/30",
              "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 group-hover:from-rose-500/30 group-hover:to-red-500/30",
              "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 group-hover:from-indigo-500/30 group-hover:to-violet-500/30",
            ];
            const style = gradients[index % gradients.length];
            // Improved logic to extract just the base gradient part for the background
            const bgClass = style.split(" text-")[0];
            const textClass = "text-" + style.split(" text-")[1].split(" ")[0]; // simplified text extraction

            return (
              <motion.div key={tag.id} variants={item}>
                <Card
                  isPressable
                  onPress={() => navigate(`/blogs?tag=${tag.id}&tagName=${encodeURIComponent(tag.name)}`)}
                  className="group h-48 w-full border border-white/40 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                >
                  <CardBody className="p-0 h-full relative z-10 overflow-hidden">
                    {/* Simplified Hover Gradient - No movement, just fade */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content Container */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                      {/* Icon Bubble */}
                      <div className={`w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/10`}>
                        <TagIcon size={20} className={textClass} />
                      </div>

                      {/* Text Content */}
                      <div className="text-center w-full">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate px-2">
                          {tag.name}
                        </h3>

                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          {tag.postCount} {tag.postCount === 1 ? 'Post' : 'Posts'}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TagsPage;
