import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero opacity-50" />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <div className="p-2 rounded-lg bg-gradient-primary text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <Sparkles size={18} />
                            </div>
                            <span className="font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                                Content Hub
                            </span>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                            A modern platform for sharing knowledge, stories, and ideas.
                            Join our community of creators and start your journey today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/tags" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                    Tags
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        © {currentYear} Content Hub. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by DevTeam
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
