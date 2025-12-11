import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react';
import { User, Mail, Lock, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animation-utils';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await apiService.register({ name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000" />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md"
      >
        <Card className="glass-panel border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <CardHeader className="flex flex-col gap-4 items-center pt-10 pb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-orange to-accent-yellow text-white shadow-lg mb-2 shadow-accent-500/30">
              <UserPlus size={28} />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">Create Account</h1>
              <p className="text-secondary-500 dark:text-secondary-400">
                Join our community of creators today
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                type="text"
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onValueChange={setName}
                startContent={<User className="text-secondary-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                radius="lg"
                classNames={{
                  inputWrapper: "bg-secondary-50/50 dark:bg-secondary-900/50 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 focus-within:border-primary-500 transition-colors",
                  label: "text-secondary-600 dark:text-secondary-400"
                }}
              />

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

              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
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

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={<Lock className="text-secondary-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                radius="lg"
                classNames={{
                  inputWrapper: "bg-secondary-50/50 dark:bg-secondary-900/50 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 focus-within:border-primary-500 transition-colors",
                  label: "text-secondary-600 dark:text-secondary-400"
                }}
              />

              <Button
                type="submit"
                className="bg-gradient-to-r from-accent-orange to-accent-yellow text-white shadow-lg shadow-accent-500/30 font-semibold mt-2"
                size="lg"
                radius="lg"
                isLoading={isLoading}
                startContent={!isLoading && <Sparkles size={20} />}
              >
                Create Account
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1 bg-secondary-200 dark:bg-secondary-700" />
                <span className="text-xs text-secondary-400 font-medium uppercase tracking-wider">OR</span>
                <Divider className="flex-1 bg-secondary-200 dark:bg-secondary-700" />
              </div>

              <div className="text-center text-sm">
                <span className="text-secondary-500 dark:text-secondary-400">Already have an account? </span>
                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-500 flex items-center justify-center gap-1 inline-flex transition-colors">
                  Sign in <ArrowRight size={14} />
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
