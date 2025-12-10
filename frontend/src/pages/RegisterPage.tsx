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
      await apiService.register(name, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md px-4"
      >
        <Card className="glass-panel border-none">
          <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
            <div className="p-3 rounded-xl bg-gradient-secondary text-white shadow-lg mb-2">
              <UserPlus size={24} />
            </div>
            <h1 className="text-2xl font-bold text-center">Create Account</h1>
            <p className="text-default-500 text-center text-sm">
              Join our community of creators today
            </p>
          </CardHeader>

          <CardBody className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 text-danger text-sm text-center border border-danger-100">
                  {error}
                </div>
              )}

              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onValueChange={setName}
                startContent={<User className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                }}
              />

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onValueChange={setEmail}
                startContent={<Mail className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                }}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onValueChange={setPassword}
                startContent={<Lock className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                }}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={<Lock className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                }}
              />

              <Button
                type="submit"
                className="bg-gradient-secondary text-white shadow-lg font-semibold mt-2"
                size="lg"
                isLoading={isLoading}
                startContent={!isLoading && <Sparkles size={18} />}
              >
                Create Account
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1" />
                <span className="text-xs text-default-400">OR</span>
                <Divider className="flex-1" />
              </div>

              <div className="text-center text-sm">
                <span className="text-default-500">Already have an account? </span>
                <Link to="/login" className="text-secondary font-semibold hover:underline flex items-center justify-center gap-1 inline-flex">
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
