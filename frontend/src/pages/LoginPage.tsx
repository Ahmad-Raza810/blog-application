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
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md px-4"
      >
        <Card className="glass-panel border-none">
          <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
            <div className="p-3 rounded-xl bg-gradient-primary text-white shadow-lg mb-2">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
            <p className="text-default-500 text-center text-sm">
              Sign in to continue your journey
            </p>
          </CardHeader>

          <CardBody className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 text-danger text-sm text-center border border-danger-100">
                  {error}
                </div>
              )}

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

              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onValueChange={setPassword}
                  startContent={<Lock className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                  }}
                />
                <Link to="/forgot-password" className="text-xs text-primary text-right hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="bg-gradient-primary text-white shadow-lg font-semibold"
                size="lg"
                isLoading={isLoading}
                startContent={!isLoading && <LogIn size={18} />}
              >
                Sign In
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1" />
                <span className="text-xs text-default-400">OR</span>
                <Divider className="flex-1" />
              </div>

              <div className="text-center text-sm">
                <span className="text-default-500">Don't have an account? </span>
                <Link to="/register" className="text-primary font-semibold hover:underline flex items-center justify-center gap-1 inline-flex">
                  Sign up <ArrowRight size={14} />
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