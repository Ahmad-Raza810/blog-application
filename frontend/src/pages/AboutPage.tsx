import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Users,
    BookOpen,
    TrendingUp,
    Heart,
    Zap,
    Shield,
    Globe,
    PenTool,
    ArrowRight
} from 'lucide-react';
import { pageVariants, fadeIn, container, item } from '../utils/animation-utils';

const AboutPage: React.FC = () => {
    const stats = [
        { label: 'Active Writers', value: '10K+', icon: Users },
        { label: 'Published Articles', value: '50K+', icon: BookOpen },
        { label: 'Monthly Readers', value: '1M+', icon: TrendingUp },
        { label: 'Categories', value: '100+', icon: Globe },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Community First',
            description: 'We believe in fostering a supportive community where every voice matters and every story deserves to be heard.',
            gradient: 'from-rose-500 to-pink-500',
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Constantly evolving our platform with cutting-edge features to provide the best writing and reading experience.',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Quality Content',
            description: 'Committed to maintaining high standards of content quality while encouraging diverse perspectives and creativity.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Connecting writers and readers from around the world, breaking down barriers and building bridges through stories.',
            gradient: 'from-purple-500 to-indigo-500',
        },
    ];

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            {/* Hero Section */}
            <motion.section
                className="relative overflow-hidden rounded-3xl bg-gradient-hero py-24 px-8 md:px-16 text-white shadow-2xl text-center"
                variants={fadeIn}
            >
                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium tracking-wide uppercase">About ContentHub</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                        Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Stories</span> Come to Life
                    </h1>

                    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed text-blue-50">
                        ContentHub is more than just a blogging platform—it's a vibrant community where writers share their passion,
                        readers discover new perspectives, and ideas flourish.
                    </p>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            </motion.section>

            {/* Mission Statement */}
            <motion.section variants={fadeIn} className="max-w-4xl mx-auto">
                <Card className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-lg border border-secondary-200 dark:border-secondary-700 shadow-xl">
                    <CardBody className="p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6 text-center">
                            Our Mission
                        </h2>
                        <p className="text-lg text-secondary-700 dark:text-secondary-300 leading-relaxed text-center mb-6">
                            At ContentHub, we're on a mission to democratize content creation and make quality writing accessible to everyone.
                            We believe that every person has a unique story to tell, and we're here to provide the platform and tools to share it with the world.
                        </p>
                        <p className="text-lg text-secondary-700 dark:text-secondary-300 leading-relaxed text-center">
                            Whether you're a seasoned writer, a curious reader, or someone with a story burning inside,
                            ContentHub is your home for authentic, engaging, and thought-provoking content.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Stats Section */}
            <motion.section variants={container} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.label} variants={item}>
                            <Card className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardBody className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                                        {stat.label}
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.section>

            {/* Core Values */}
            <motion.section variants={fadeIn}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                        Our Core Values
                    </h2>
                    <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                        These principles guide everything we do at ContentHub
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <motion.div
                                key={value.title}
                                variants={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                                    <CardBody className="p-8">
                                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform`}>
                                            <Icon size={28} strokeWidth={2} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section
                variants={fadeIn}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 py-16 px-8 text-white shadow-2xl text-center"
            >
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Share Your Story?
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
                        Join thousands of writers and readers who are already part of the ContentHub community.
                        Start writing, reading, and connecting today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-white text-primary-900 hover:bg-gray-100 font-bold shadow-xl px-8 w-full sm:w-auto"
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Join the Community
                            </Button>
                        </Link>
                        <Link to="/blogs">
                            <Button
                                size="lg"
                                variant="bordered"
                                className="border-2 border-white/40 text-white hover:bg-white/10 font-bold px-8 w-full sm:w-auto"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Explore Articles
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </motion.section>
        </motion.div>
    );
};

export default AboutPage;
