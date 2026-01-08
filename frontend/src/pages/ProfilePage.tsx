import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { apiService, Post, extractErrorMessage } from '../services/apiService';
import { Card, CardBody, CardHeader, Button, Avatar, Tabs, Tab, Chip } from '@nextui-org/react';
import { Edit, Trash2, Plus, FileText, Heart, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, container, item } from '../utils/animation-utils';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const allUserPosts = await apiService.getUserPosts();

        setPublishedPosts(allUserPosts.filter(p => p.status === 'PUBLISHED'));
        setDraftPosts(allUserPosts.filter(p => p.status === 'DRAFT'));
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load profile data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (postId: string, isDraft: boolean = false) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiService.deletePost(postId);
        if (isDraft) {
          setDraftPosts(draftPosts.filter(post => post.id !== postId));
        } else {
          setPublishedPosts(publishedPosts.filter(post => post.id !== postId));
        }
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  if (!user) return null;

  const renderPostCard = (post: Post, isDraft: boolean) => (
    <motion.div key={post.id} variants={item}>
      <Card className="hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800">
        <CardBody className="flex flex-row gap-4 p-4">
          <div className="w-24 h-24 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
            {post.coverImage ? (
              <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                <FileText size={24} />
              </div>
            )}
          </div>
          <div className="flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                <Chip size="sm" variant="flat" color={isDraft ? "warning" : "primary"}>
                  {isDraft ? "Draft" : post.category.name}
                </Chip>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-400">
                {isDraft ? 'Created' : 'Published'} on {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <Button
                  as={Link}
                  to={`/posts/${post.id}/edit`}
                  size="sm"
                  variant="light"
                  isIconOnly
                  color="primary"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  color="danger"
                  onPress={() => handleDelete(post.id, isDraft)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Profile Header */}
      <div className="relative mb-24 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 pb-4 overflow-visible">
        <div className="h-48 rounded-t-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300" />

        <div className="px-8 flex items-end relative -mt-16 sm:-mt-20 pb-2">
          <div className="relative z-10">
            <div className="rounded-full p-1.5 bg-white dark:bg-slate-900">
              <Avatar
                src={undefined}
                name={user.name}
                className="w-32 h-32 sm:w-40 sm:h-40 text-4xl"
                classNames={{
                  base: "bg-blue-500 text-white",
                }}
              />
            </div>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-end justify-between ml-4 sm:ml-6 mb-2 sm:mb-4 gap-4">
            <div className="mt-16 sm:mt-0">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="light"
                color="primary"
                startContent={<Edit size={18} />}
                className="font-medium px-2 min-w-0 h-auto gap-2"
              >
                Edit
              </Button>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
              <Button
                variant="light"
                color="danger"
                startContent={<LogOut size={18} />}
                onPress={logout}
                className="font-medium px-2 min-w-0 h-auto gap-2"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <Card className="glass-panel border-none p-4">
            <CardHeader className="font-bold text-lg pb-2">Dashboard Stats</CardHeader>
            <CardBody className="gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FileText size={20} />
                  </div>
                  <span className="font-medium">Total Posts</span>
                </div>
                <span className="text-xl font-bold">{publishedPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <Edit size={20} />
                  </div>
                  <span className="font-medium">Drafts</span>
                </div>
                <span className="text-xl font-bold">{draftPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <MessageSquare size={20} />
                  </div>
                  <span className="font-medium">Comments</span>
                </div>
                <span className="text-xl font-bold">0</span>
              </div>
            </CardBody>
          </Card>

          <Button
            as={Link}
            to="/posts/new"
            className="w-full bg-gradient-primary text-white shadow-lg font-semibold py-6"
            startContent={<Plus size={24} />}
          >
            Create New Post
          </Button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            aria-label="Profile Options"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary font-medium text-base"
            }}
          >
            <Tab key="posts" title="My Posts">
              <div className="py-6 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 w-full bg-default-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : publishedPosts.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 mb-4">You haven't published any posts yet.</p>
                    <Button as={Link} to="/posts/new" color="primary" variant="flat">
                      Write your first post
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {publishedPosts.map(post => renderPostCard(post, false))}
                  </motion.div>
                )}
              </div>
            </Tab>
            <Tab key="drafts" title="Drafts">
              <div className="py-6 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1].map(i => (
                      <div key={i} className="h-24 w-full bg-default-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : draftPosts.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 mb-4">No drafts found.</p>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {draftPosts.map(post => renderPostCard(post, true))}
                  </motion.div>
                )}
              </div>
            </Tab>
            <Tab key="saved" title="Saved">
              <div className="py-12 text-center text-slate-500">
                <p>Saved posts functionality coming soon!</p>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
