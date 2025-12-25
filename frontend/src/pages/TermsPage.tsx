import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, UserX, Scale, Shield, Mail } from 'lucide-react';
import { pageVariants, fadeIn } from '../utils/animation-utils';

const TermsPage: React.FC = () => {
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
                    <FileText size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white">
                    Terms of Service
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400">
                    Last Updated: {lastUpdated}
                </p>
            </motion.div>

            {/* Introduction */}
            <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                <CardBody className="p-8">
                    <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        Welcome to ContentHub! These Terms of Service ("Terms") govern your access to and use of ContentHub's
                        website, services, and applications. By accessing or using ContentHub, you agree to be bound by these Terms.
                        If you do not agree to these Terms, please do not use our services.
                    </p>
                </CardBody>
            </Card>

            {/* Acceptance of Terms */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Scale size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Acceptance of Terms
                            </h2>
                        </div>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            By creating an account or using ContentHub, you confirm that you are at least 13 years old (or the age of
                            majority in your jurisdiction) and have the legal capacity to enter into these Terms. If you are using
                            ContentHub on behalf of an organization, you represent that you have the authority to bind that organization
                            to these Terms.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* User Accounts */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            User Accounts and Responsibilities
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Account Creation
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    To access certain features, you must create an account. You agree to provide accurate, current, and
                                    complete information during registration and to update such information to keep it accurate and current.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Account Security
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-2">
                                    You are responsible for maintaining the confidentiality of your account credentials and for all
                                    activities that occur under your account. You must:
                                </p>
                                <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary-600 mt-1">•</span>
                                        <span>Use a strong, unique password</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary-600 mt-1">•</span>
                                        <span>Not share your account credentials with others</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary-600 mt-1">•</span>
                                        <span>Notify us immediately of any unauthorized use of your account</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Content Guidelines */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Content Guidelines and Conduct
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Your Content
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    You retain ownership of any content you post on ContentHub. By posting content, you grant us a
                                    worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content
                                    in connection with operating and promoting the platform.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Prohibited Content
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-2">
                                    You agree not to post content that:
                                </p>
                                <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Violates any laws or regulations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Infringes on intellectual property rights</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Contains hate speech, harassment, or threats</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Includes spam, malware, or phishing attempts</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Contains explicit adult content or violence</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Impersonates others or misrepresents your affiliation</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    Content Moderation
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    We reserve the right to remove any content that violates these Terms or that we deem inappropriate,
                                    without prior notice. Repeated violations may result in account suspension or termination.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Intellectual Property */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Intellectual Property Rights
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            The ContentHub platform, including its design, features, functionality, and content (excluding user-generated
                            content), is owned by ContentHub and is protected by copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            You may not copy, modify, distribute, sell, or lease any part of our services or software without our
                            explicit written permission.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Termination */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                <UserX size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Account Termination
                            </h2>
                        </div>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            You may delete your account at any time through your account settings. We reserve the right to suspend
                            or terminate your account if you violate these Terms or engage in conduct that we determine to be harmful
                            to other users or to ContentHub.
                        </p>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            Upon termination, your right to use the services will immediately cease. We may retain certain information
                            as required by law or for legitimate business purposes.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Disclaimers */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600">
                                <AlertCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Disclaimers and Limitations
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Service "As Is"
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    ContentHub is provided "as is" and "as available" without warranties of any kind, either express or
                                    implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    Limitation of Liability
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    To the maximum extent permitted by law, ContentHub shall not be liable for any indirect, incidental,
                                    special, consequential, or punitive damages arising out of or related to your use of the service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                    User Content Disclaimer
                                </h3>
                                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                    We are not responsible for user-generated content. Views expressed by users do not represent the
                                    views of ContentHub.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Changes to Terms */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Changes to These Terms
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            We may update these Terms from time to time. We will notify you of any material changes by posting the
                            new Terms on this page and updating the "Last Updated" date. Your continued use of ContentHub after such
                            changes constitutes your acceptance of the new Terms.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Governing Law */}
            <motion.section variants={fadeIn}>
                <Card className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <CardBody className="p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Governing Law and Disputes
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                            ContentHub operates, without regard to its conflict of law provisions. Any disputes arising from these
                            Terms or your use of ContentHub shall be resolved through binding arbitration.
                        </p>
                    </CardBody>
                </Card>
            </motion.section>

            {/* Contact */}
            <motion.section variants={fadeIn}>
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                    <CardBody className="p-8 text-center">
                        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                            Questions About These Terms?
                        </h2>
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-4">
                            If you have any questions or concerns about these Terms of Service, please contact us at:
                        </p>
                        <a
                            href="mailto:legal@contenthub.com"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            legal@contenthub.com
                        </a>
                    </CardBody>
                </Card>
            </motion.section>
        </motion.div>
    );
};

export default TermsPage;
