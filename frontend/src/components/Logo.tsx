import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ showText = true, className = '' }) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Logo icon with vibrant gradient background */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-lg relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 opacity-30"
          >
            <Sparkles size={16} className="absolute top-1 right-1 text-white" />
            <Sparkles size={12} className="absolute bottom-2 left-2 text-white" />
          </motion.div>
          <BookOpen size={26} className="text-white relative z-10" strokeWidth={2.5} />
        </div>
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-accent-1 opacity-40 blur-lg"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl font-bold font-display gradient-text">
            Content Hub
          </span>
          <span className="text-xs font-medium text-default-500 -mt-1 tracking-wide">
            Share Your Knowledge
          </span>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;
