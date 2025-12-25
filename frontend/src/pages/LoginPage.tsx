import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react';
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animation-utils';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Successful login - navigate to home
      navigate('/');
    } catch (err: any) {
      // Handle error - keep form values and show error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow lg:delay-1000" />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md"
      >
        <Card className="glass-panel border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <CardHeader className="flex flex-col gap-4 items-center pt-10 pb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple text-white shadow-lg mb-2 shadow-primary-500/30">
              <Sparkles size={28} />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">Welcome Back</h1>
              <p className="text-secondary-500 dark:text-secondary-400">
                Sign in to continue your creative journey
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-100 dark:border-red-900/50"
                >
                  {error}
                </motion.div>
              )}

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onValueChange={setEmail}
                startContent={<Mail className="text-secondary-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                radius="lg"
                classNames={{
                  inputWrapper: "bg-secondary-50/50 dark:bg-secondary-900/50 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 focus-within:border-primary-500 transition-colors",
                  label: "text-secondary-600 dark:text-secondary-400"
                }}
              />

              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onValueChange={setPassword}
                  startContent={<Lock className="text-secondary-400 pointer-events-none flex-shrink-0" size={18} />}
                  variant="bordered"
                  radius="lg"
                  classNames={{
                    inputWrapper: "bg-secondary-50/50 dark:bg-secondary-900/50 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 focus-within:border-primary-500 transition-colors",
                    label: "text-secondary-600 dark:text-secondary-400"
                  }}
                />
                <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 text-right hover:text-primary-500 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="bg-gradient-primary text-white shadow-lg shadow-primary-500/30 font-semibold"
                size="lg"
                radius="lg"
                isLoading={isLoading}
                startContent={!isLoading && <LogIn size={20} />}
              >
                Sign In
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1 bg-secondary-200 dark:bg-secondary-700" />
                <span className="text-xs text-secondary-400 font-medium uppercase tracking-wider">OR</span>
                <Divider className="flex-1 bg-secondary-200 dark:bg-secondary-700" />
              </div>

              <div className="text-center text-sm">
                <span className="text-secondary-500 dark:text-secondary-400">Don't have an account? </span>
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-500 flex items-center justify-center gap-1 inline-flex transition-colors">
                  Sign up now <ArrowRight size={14} />
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;