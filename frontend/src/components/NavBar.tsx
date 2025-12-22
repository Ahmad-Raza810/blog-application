import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useTheme } from '../hooks/useTheme';
import { Menu, X, Search, Sun, Moon, User, LogOut, PenTool, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NavLink = {
  name: string;
  path?: string;
  children?: { name: string; path: string }[];
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    {
      name: 'Explore',
      children: [
        { name: 'Categories', path: '/categories' },
        { name: 'Trending', path: '/trending' },
        { name: 'Tags', path: '/tags' },
      ]
    },
    { name: 'About', path: '/about' },
  ];

  const handleDropdownEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-purple dark:from-primary-400 dark:to-accent-purple">
              ContentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.children && handleDropdownEnter(link.name)}
                onMouseLeave={handleDropdownLeave}
              >
                {link.path ? (
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === link.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-300'
                      }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${activeDropdown === link.name
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-300'
                      }`}
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Desktop Dropdown */}
                {link.children && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 py-2 transition-all duration-200 origin-top-left ${activeDropdown === link.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-secondary-50 dark:bg-secondary-800 border-none focus:ring-1 focus:ring-primary-500 h-9 transition-all"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/create-post">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <PenTool className="w-4 h-4" />
                    Write
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-purple p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-secondary-900 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-secondary-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  {/* User Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-secondary-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                      Profile
                    </Link>
                    <Link to="/posts/drafts" className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                      My Drafts
                    </Link>
                    <Link to="/saved" className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                      Saved Posts
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </form>
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.path ? (
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === link.path
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                          }`}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-secondary-900 dark:text-white">
                          {link.name}
                        </div>
                        <div className="pl-4 space-y-1 border-l-2 border-secondary-100 dark:border-secondary-800 ml-3">
                          {link.children?.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => setIsMenuOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === child.path
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                                }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-secondary-200 dark:border-secondary-800">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-secondary-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/create-post" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <PenTool className="w-4 h-4" />
                        Start Writing
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Profile</Button>
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;