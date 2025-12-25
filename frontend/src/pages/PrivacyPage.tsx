    import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Database, Bell } from 'lucide-react';
import { pageVariants, fadeIn } from '../utils/animation-utils';

const PrivacyPage: React.FC = () => {
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-4">
                    <Shield size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white">
                    Privacy Policy
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400">
                    Last Updated: {lastUpdated}
                </p>
            </motion.div>

            {/* Introduction */}
            <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                <CardBody className="p-8">
                    <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        At ContentHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your information when you visit our platform. Please read this privacy policy carefully.
                        If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>
                </CardBody>
            </Card>

            {/* Information We Collect */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                                <Database size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Information We Collect
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Personal Information
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    When you register for an account, we collect personal information such as your name, email address,
                                    username, and password. If you choose to add a profile picture or bio, we also collect that information.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Content Information
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    We collect the content you create, post, or share on ContentHub, including blog posts, comments,
                                    likes, and any media files you upload.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Usage Information
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    We automatically collect certain information about your device and how you interact with our platform,
                                    including your IP address, browser type, operating system, pages visited, time spent on pages,
                                    and referring URLs.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Cookies and Tracking Technologies
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    We use cookies and similar tracking technologies to track activity on our platform and store certain
                                    information. For more details, please see our Cookie Policy.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* How We Use Your Information */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Eye size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                How We Use Your Information
                            </h2>
                        </div>

                        <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To create and manage your account</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To provide, maintain, and improve our services</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To personalize your experience and deliver content relevant to your interests</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To communicate with you about updates, newsletters, and promotional materials</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To monitor and analyze usage patterns and trends</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To detect, prevent, and address technical issues and security threats</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>To comply with legal obligations and enforce our terms of service</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Data Protection */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Data Protection & Security
                            </h2>
                        </div>

                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            We implement appropriate technical and organizational security measures to protect your personal information
                            against unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>

                        <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>Encryption of data in transit using SSL/TLS protocols</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>Secure password hashing and storage</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>Regular security audits and vulnerability assessments</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>Access controls and authentication mechanisms</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>Regular backups and disaster recovery procedures</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Your Rights */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                <UserCheck size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Your Privacy Rights
                            </h2>
                        </div>

                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            You have certain rights regarding your personal information:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Access and Portability
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    You have the right to request a copy of your personal data in a structured, commonly used format.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Correction
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    You can update or correct your personal information through your account settings.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Deletion
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    You have the right to request deletion of your account and associated data, subject to legal obligations.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Opt-Out
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300">
                                    You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Third-Party Sharing */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Third-Party Sharing
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                        </p>
                        <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>Service providers who assist in operating our platform (e.g., hosting, analytics)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>Law enforcement or regulatory authorities when required by law</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600 mt-1">•</span>
                                <span>Other users when you choose to make your content public</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Contact */}
            <motion.section variants={fadeIn}>
                <Card className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800">
                    <CardBody className="p-8 text-center">
                        <Bell className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Questions About Privacy?
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-4">
                            If you have any questions or concerns about this Privacy Policy or our data practices,
                            please contact us at:
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

export default PrivacyPage;
