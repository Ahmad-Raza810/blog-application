import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold text-xl">
                                C
                            </div>
                            <span className="font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-purple dark:from-primary-400 dark:to-accent-purple">
                                ContentHub
                            </span>
                        </Link>
                        <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed">
                            Discover stories, thinking, and expertise from writers on any topic. A place where ideas find their home.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-6">Explore</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/trending" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Trending
                                </Link>
                            </li>
                            <li>
                                <Link to="/tags" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Tags
                                </Link>
                            </li>
                            <li>
                                <Link to="/authors" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Top Authors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-6">Newsletter</h3>
                        <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">
                            Subscribe to our newsletter to get the latest updates.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-colors"
                                />
                                <Mail className="absolute right-3 top-2.5 w-4 h-4 text-secondary-400" />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-secondary-200 dark:border-secondary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        © {currentYear} ContentHub. All rights reserved.
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Ahmad
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
