import React from 'react';
import { motion } from 'framer-motion';
import { animationConfig } from '../../utils/weatherUtils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
  tap?: boolean;
}

/**
 * Reusable animated card component using Framer Motion
 * Provides consistent animations across the weather app
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.3,
  hover = true,
  tap = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: duration || animationConfig.normal,
        delay,
        ease: 'easeOut'
      }}
      whileHover={hover ? {
        scale: 1.02,
        transition: animationConfig.fastTransition
      } : undefined}
      whileTap={tap ? {
        scale: 0.98,
        transition: { duration: 0.1, ease: 'easeOut' }
      } : undefined}
      className={`glass-effect rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated container for lists and grids
 */
export const AnimatedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}> = ({ children, className = '', stagger = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
                  transition: {
          staggerChildren: stagger || animationConfig.stagger
        }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated item for staggered animations
 */
export const AnimatedItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={animationConfig.standardTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated loading spinner with Framer Motion
 */
export const AnimatedSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`flex flex-col items-center space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animationConfig.standardTransition}
    >
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.p
        className="text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        Loading weather data...
      </motion.p>
    </motion.div>
  );
};
