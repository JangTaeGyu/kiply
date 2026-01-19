'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'ghost' | 'candy';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
}

const variantStyles = {
  primary: {
    bg: 'bg-gradient-to-br from-primary to-primary-dark',
    text: 'text-white',
    shadow: 'shadow-[0_6px_20px_rgba(255,107,157,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(255,107,157,0.5)]',
    border: 'border-2 border-primary-light/50',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-secondary to-secondary-dark',
    text: 'text-white',
    shadow: 'shadow-[0_6px_20px_rgba(0,212,255,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(0,212,255,0.5)]',
    border: 'border-2 border-secondary-light/50',
  },
  accent: {
    bg: 'bg-gradient-to-br from-accent to-accent-dark',
    text: 'text-foreground',
    shadow: 'shadow-[0_6px_20px_rgba(255,217,61,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(255,217,61,0.5)]',
    border: 'border-2 border-accent-light/50',
  },
  success: {
    bg: 'bg-gradient-to-br from-success to-[#4CAF50]',
    text: 'text-white',
    shadow: 'shadow-[0_6px_20px_rgba(107,203,119,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(107,203,119,0.5)]',
    border: 'border-2 border-success-light/50',
  },
  ghost: {
    bg: 'bg-white/90 backdrop-blur-sm',
    text: 'text-foreground',
    shadow: 'shadow-soft',
    hoverShadow: 'hover:shadow-lg',
    border: 'border-2 border-primary-light/30',
  },
  candy: {
    bg: 'bg-gradient-candy',
    text: 'text-white',
    shadow: 'shadow-candy',
    hoverShadow: 'hover:shadow-[0_10px_30px_rgba(255,107,157,0.5)]',
    border: 'border-2 border-white/30',
  },
};

const sizeStyles = {
  sm: 'px-5 py-2.5 text-sm min-h-[44px] rounded-2xl',
  md: 'px-7 py-3.5 text-base min-h-[52px] rounded-2xl',
  lg: 'px-9 py-4.5 text-lg min-h-[60px] rounded-3xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  type = 'button',
  icon,
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${styles.bg}
        ${styles.text}
        ${styles.shadow}
        ${styles.hoverShadow}
        ${styles.border}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        font-bold
        relative overflow-hidden
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        touch-target
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
        animate={{ x: ['0%', '200%'] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
        style={{ width: '50%' }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && (
          <motion.span
            className="text-lg"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </span>
    </motion.button>
  );
}
