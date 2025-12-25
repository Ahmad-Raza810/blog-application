import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Cookie, Settings, BarChart, Shield, X } from 'lucide-react';
import { pageVariants, fadeIn } from '../utils/animation-utils';

const CookiePage: React.FC = () => {
    const lastUpdated = "December 25, 2024";

    return (
        <motion.div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            {/* Header */}
            <motion.div variants={fadeIn} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
                    <Cookie size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white">
                    Cookie Policy
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400">
                    Last Updated: {lastUpdated}
                </p>
            </motion.div>

            {/* Introduction */}
            <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                <CardBody className="p-8">
                    <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        ContentHub uses cookies and similar tracking technologies to improve your browsing experience,
                        analyze site traffic, and understand where our visitors are coming from. This Cookie Policy explains
                        what cookies are, how we use them, and how you can control them.
                    </p>
                </CardBody>
            </Card>

            {/* What Are Cookies */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                                <Cookie size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                What Are Cookies?
                            </h2>
                        </div>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            Cookies are small text files that are placed on your device when you visit a website. They are widely
                            used to make websites work more efficiently and provide information to website owners. Cookies can be
                            "persistent" or "session" cookies.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Session Cookies</h3>
                                <p className="text-sm text-secondary-700 dark:text-secondary-300">
                                    Temporary cookies that expire when you close your browser
                                </p>
                            </div>
                            <div className="p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Persistent Cookies</h3>
                                <p className="text-sm text-secondary-700 dark:text-secondary-300">
                                    Remain on your device until deleted or they expire
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Types of Cookies We Use */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Types of Cookies We Use
                        </h2>

                        <div className="space-y-6">
                            {/* Essential Cookies */}
                            <div className="border-l-4 border-green-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                        Essential Cookies
                                    </h3>
                                </div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-2">
                                    These cookies are necessary for the website to function properly. They enable core functionality
                                    such as security, network management, and accessibility.
                                </p>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 italic">
                                    Examples: Authentication tokens, session management, security features
                                </p>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                        Analytics Cookies
                                    </h3>
                                </div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-2">
                                    These cookies help us understand how visitors interact with our website by collecting and
                                    reporting information anonymously.
                                </p>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 italic">
                                    Examples: Google Analytics, page views, bounce rate, traffic sources
                                </p>
                            </div>

                            {/* Functionality Cookies */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                        Functionality Cookies
                                    </h3>
                                </div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-2">
                                    These cookies enable the website to provide enhanced functionality and personalization based on
                                    your preferences.
                                </p>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 italic">
                                    Examples: Theme preferences (dark/light mode), language settings, remembered preferences
                                </p>
                            </div>

                            {/* Advertising Cookies */}
                            <div className="border-l-4 border-orange-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Cookie className="w-5 h-5 text-orange-600" />
                                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                        Advertising Cookies
                                    </h3>
                                </div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-2">
                                    These cookies may be set through our site by our advertising partners to build a profile of your
                                    interests and show you relevant content.
                                </p>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 italic">
                                    Examples: Ad targeting, retargeting campaigns, conversion tracking
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Third-Party Cookies */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Third-Party Cookies
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            In addition to our own cookies, we may also use various third-party cookies to report usage statistics,
                            deliver advertisements, and provide social media features. These include:
                        </p>
                        <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span><strong>Google Analytics:</strong> To analyze website traffic and user behavior</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span><strong>Social Media Platforms:</strong> For social sharing and login functionality</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span><strong>Content Delivery Networks:</strong> To optimize content delivery and performance</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Managing Cookies */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                <X size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                How to Control Cookies
                            </h2>
                        </div>

                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences
                            by setting or amending your web browser controls.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Browser Settings
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    Most web browsers allow you to control cookies through their settings. You can set your browser to
                                    refuse cookies or delete certain cookies. Note that if you disable cookies, some features of our
                                    website may not function properly.
                                </p>
                            </div>

                            <div className="bg-secondary-50 dark:bg-secondary-900/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">Browser-Specific Instructions:</h4>
                                <ul className="space-y-1 text-sm text-secondary-700 dark:text-secondary-300">
                                    <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                    <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                                    <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                                    <li>• <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Opt-Out Tools
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    You can also opt out of certain third-party cookies through industry opt-out programs such as the
                                    Network Advertising Initiative (NAI) or the Digital Advertising Alliance (DAA).
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Updates to Policy */}
            <motion.section variants={fadeIn}>
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                    <CardBody className="p-8">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Updates to This Policy
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                            operational, legal, or regulatory reasons. We encourage you to review this page periodically for the
                            latest information on our cookie practices.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Contact */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Questions About Cookies?
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-4">
                            If you have any questions about our use of cookies, please contact us at:
                        </p>
                        <a
                            href="mailto:privacy@contenthub.com"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            privacy@contenthub.com
                        </a>
                    </CardBody>
                </Card>
            </motion.section>
        </motion.div>
    );
};

export default CookiePage;
