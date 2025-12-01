import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Spinner,
} from '@nextui-org/react';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  BookOpen,
  FileText,
  Plus,
  Edit,
  Trash,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { apiService, Post, PostStatus, extractErrorMessage } from '../services/apiService';
import { useAuth } from '../components/AuthContext';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });

  useEffect(() => {
    // Check authentication instead of user object
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile and posts in parallel
      const [profileResult, allUserPosts] = await Promise.allSettled([
        apiService.getUserProfile().catch(() => null), // Don't fail if profile fetch fails
        apiService.getUserPosts()
      ]);

      // Set user profile
      if (profileResult.status === 'fulfilled' && profileResult.value) {
        setProfileUser(profileResult.value);
      } else if (user) {
        // Fallback to user from AuthContext
        setProfileUser(user);
      } else if (allUserPosts.status === 'fulfilled' && allUserPosts.value.length > 0) {
        // Last resort: extract from posts
        const firstPost = allUserPosts.value[0];
        if (firstPost.author) {
          setProfileUser({
            id: firstPost.author.id,
            name: firstPost.author.name,
            email: ''
          });
        }
      }

      // Get posts array
      const posts = allUserPosts.status === 'fulfilled' ? allUserPosts.value : [];
      
      // Separate into drafts and published posts
      const draftsData = posts.filter(post => 
        post.status === PostStatus.DRAFT || post.status === 'DRAFT'
      );
      const publishedData = posts.filter(post => 
        post.status === PostStatus.PUBLISHED || post.status === 'PUBLISHED'
      );

      setDraftPosts(draftsData);
      setPublishedPosts(publishedData);
      setUserPosts(posts);
      
      setStats({
        totalPosts: posts.length,
        publishedPosts: publishedData.length,
        draftPosts: draftsData.length,
      });
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load profile data. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await apiService.deletePost(postId);
      // Refresh posts after deletion
      fetchUserData();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete post. Please try again.'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="w-full">
          <CardBody className="flex justify-center items-center min-h-[400px]">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="w-full">
          <CardBody className="flex flex-col items-center gap-4 py-12">
            <div className="p-4 bg-danger-100 rounded-full">
              <AlertCircle size={48} className="text-danger" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-default-700">{error}</h3>
              <p className="text-sm text-default-500 mt-1">Please log in to view your profile.</p>
            </div>
            <Button
              as={Link}
              to="/login"
              color="primary"
              className="mt-2"
            >
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Header */}
      <Card className="w-full mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                name={profileUser?.name || user?.name || 'User'}
                className="w-20 h-20 text-large"
              />
              <div>
                <h1 className="text-2xl font-bold">{profileUser?.name || user?.name || 'User'}</h1>
                <p className="text-default-500 mt-1">{profileUser?.email || user?.email || ''}</p>
              </div>
            </div>
            <Button
              as={Link}
              to="/posts/new"
              color="primary"
              startContent={<Plus size={16} />}
            >
              New Post
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-default-100 rounded-lg">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
                <p className="text-sm text-default-500">Total Posts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-default-100 rounded-lg">
              <div className="p-2 bg-success-100 rounded-lg">
                <BookOpen className="text-success" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.publishedPosts}</p>
                <p className="text-sm text-default-500">Published</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-default-100 rounded-lg">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Edit3 className="text-warning" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.draftPosts}</p>
                <p className="text-sm text-default-500">Drafts</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* User Details Card */}
      <Card className="w-full mb-6">
        <CardHeader className="flex items-center gap-2">
          <User size={20} className="text-primary" />
          <h2 className="text-xl font-bold">Profile Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <User size={20} className="text-default-400" />
            <div>
              <p className="text-sm text-default-500">Name</p>
              <p className="font-medium">{profileUser?.name || user?.name || 'N/A'}</p>
            </div>
          </div>
          <Divider />
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-default-400" />
            <div>
              <p className="text-sm text-default-500">Email</p>
              <p className="font-medium">{profileUser?.email || user?.email || 'N/A'}</p>
            </div>
          </div>
          {/* TODO: Add more user details when available from backend */}
        </CardBody>
      </Card>

      {/* Posts Tabs */}
      <Card className="w-full">
        <CardHeader className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <h2 className="text-xl font-bold">My Posts</h2>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Post types" defaultSelectedKey="all">
            <Tab
              key="all"
              title={
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  All Posts
                  <Chip size="sm" variant="flat">
                    {stats.totalPosts}
                  </Chip>
                </div>
              }
            >
              <div className="space-y-4 mt-4">
                {userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-default-100 rounded-full">
                        <FileText size={48} className="text-default-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-default-700">No posts yet</h3>
                        <p className="text-sm text-default-500 mt-1">Create your first post to get started!</p>
                      </div>
                      <Button
                        as={Link}
                        to="/posts/new"
                        color="primary"
                        variant="flat"
                        className="mt-2"
                        startContent={<Plus size={16} />}
                      >
                        Create Post
                      </Button>
                    </div>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <Card key={post.id} className="hover:bg-default-50 transition-colors">
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-primary flex-shrink-0" />
                              <Link
                                to={`/posts/${post.id}`}
                                className="text-lg font-semibold hover:text-primary flex-1"
                              >
                                {post.title}
                              </Link>
                              {post.status === 'DRAFT' ? (
                                <Chip size="sm" color="warning" variant="flat" startContent={<Edit3 size={12} />}>
                                  Draft
                                </Chip>
                              ) : (
                                <Chip size="sm" color="success" variant="flat" startContent={<BookOpen size={12} />}>
                                  Published
                                </Chip>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-default-500 mb-2">
                              <Calendar size={14} />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Chip size="sm" variant="flat" startContent={<BookOpen size={12} />}>
                                {post.category.name}
                              </Chip>
                              {post.tags.slice(0, 3).map((tag) => (
                                <Chip key={tag.id} size="sm" variant="flat" startContent={<Tag size={12} />}>
                                  {tag.name}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              as={Link}
                              to={`/posts/${post.id}/edit`}
                              size="sm"
                              variant="flat"
                              isIconOnly
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
            <Tab
              key="published"
              title={
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Published
                  <Chip size="sm" variant="flat">
                    {stats.publishedPosts}
                  </Chip>
                </div>
              }
            >
              <div className="space-y-4 mt-4">
                {publishedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-default-100 rounded-full">
                        <BookOpen size={48} className="text-default-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-default-700">No published posts yet</h3>
                        <p className="text-sm text-default-500 mt-1">Publish your drafts to see them here.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  publishedPosts.map((post) => (
                    <Card key={post.id} className="hover:bg-default-50 transition-colors">
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-primary flex-shrink-0" />
                              <Link
                                to={`/posts/${post.id}`}
                                className="text-lg font-semibold hover:text-primary flex-1"
                              >
                                {post.title}
                              </Link>
                              <Chip size="sm" color="success" variant="flat" startContent={<BookOpen size={12} />}>
                                Published
                              </Chip>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-default-500 mb-2">
                              <Calendar size={14} />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Chip size="sm" variant="flat" startContent={<BookOpen size={12} />}>
                                {post.category.name}
                              </Chip>
                              {post.tags.slice(0, 3).map((tag) => (
                                <Chip key={tag.id} size="sm" variant="flat" startContent={<Tag size={12} />}>
                                  {tag.name}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              as={Link}
                              to={`/posts/${post.id}/edit`}
                              size="sm"
                              variant="flat"
                              isIconOnly
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
            <Tab
              key="drafts"
              title={
                <div className="flex items-center gap-2">
                  <Edit3 size={16} />
                  Drafts
                  <Chip size="sm" variant="flat">
                    {stats.draftPosts}
                  </Chip>
                </div>
              }
            >
              <div className="space-y-4 mt-4">
                {draftPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-default-100 rounded-full">
                        <Edit3 size={48} className="text-default-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-default-700">No draft posts yet</h3>
                        <p className="text-sm text-default-500 mt-1">Start writing to create your first draft.</p>
                      </div>
                      <Button
                        as={Link}
                        to="/posts/new"
                        color="primary"
                        variant="flat"
                        className="mt-2"
                        startContent={<Plus size={16} />}
                      >
                        Create Draft
                      </Button>
                    </div>
                  </div>
                ) : (
                  draftPosts.map((post) => (
                    <Card key={post.id} className="hover:bg-default-50 transition-colors">
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-primary flex-shrink-0" />
                              <Link
                                to={`/posts/${post.id}/edit`}
                                className="text-lg font-semibold hover:text-primary flex-1"
                              >
                                {post.title}
                              </Link>
                              <Chip size="sm" color="warning" variant="flat" startContent={<Edit3 size={12} />}>
                                Draft
                              </Chip>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-default-500 mb-2">
                              <Calendar size={14} />
                              Last updated: {formatDate(post.updatedAt)}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Chip size="sm" variant="flat" startContent={<BookOpen size={12} />}>
                                {post.category.name}
                              </Chip>
                              {post.tags.slice(0, 3).map((tag) => (
                                <Chip key={tag.id} size="sm" variant="flat" startContent={<Tag size={12} />}>
                                  {tag.name}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              as={Link}
                              to={`/posts/${post.id}/edit`}
                              size="sm"
                              variant="flat"
                              isIconOnly
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;

