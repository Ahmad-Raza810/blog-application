import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Explore',
            links: [
                { name: 'Home', path: '/' },
                { name: 'Categories', path: '/categories' },
                { name: 'Tags', path: '/tags' },
                { name: 'Drafts', path: '/posts/drafts' },
            ]
        },
        {
            title: 'Community',
            links: [
                { name: 'About Us', path: '#' },
                { name: 'Guidelines', path: '#' },
                { name: 'Privacy Policy', path: '#' },
                { name: 'Terms of Service', path: '#' },
            ]
        }
    ];

    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:contact@contenthub.com', label: 'Email' },
    ];

    return (
        <footer className="w-full bg-white border-t border-default-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-default-500 text-sm leading-relaxed max-w-xs">
                            A modern platform for sharing knowledge, ideas, and stories.
                            Join our growing community of creators and readers today.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="text-default-400 hover:text-primary transition-colors hover:scale-110 transform duration-200"
                                        aria-label={social.label}
                                    >
                                        <Icon size={20} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-display font-bold text-lg mb-4 text-default-800">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-default-500 hover:text-primary transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Section (Visual only for now) */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-4 text-default-800">
                            Stay Updated
                        </h3>
                        <p className="text-default-500 text-sm mb-4">
                            Subscribe to our newsletter for the latest updates and featured stories.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-default-100 px-4 py-2 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <button className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-default-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-default-400 text-sm">
                        © {currentYear} Content Hub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-default-400 text-sm">
                        <span>Made with</span>
                        <Heart size={14} className="text-danger fill-danger animate-pulse" />
                        <span>by Content Hub Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
