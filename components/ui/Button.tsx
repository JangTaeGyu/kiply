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
    shadow: 'shadow-[0_6px_20px_rgba(45,212,191,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(45,212,191,0.5)]',
    border: 'border-2 border-primary-light/50',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-secondary to-secondary-dark',
    text: 'text-white',
    shadow: 'shadow-[0_6px_20px_rgba(6,182,212,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(6,182,212,0.5)]',
    border: 'border-2 border-secondary-light/50',
  },
  accent: {
    bg: 'bg-gradient-to-br from-accent to-accent-dark',
    text: 'text-foreground',
    shadow: 'shadow-[0_6px_20px_rgba(251,191,36,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(251,191,36,0.5)]',
    border: 'border-2 border-accent-light/50',
  },
  success: {
    bg: 'bg-gradient-to-br from-success to-[#059669]',
    text: 'text-white',
    shadow: 'shadow-[0_6px_20px_rgba(52,211,153,0.4)]',
    hoverShadow: 'hover:shadow-[0_8px_25px_rgba(52,211,153,0.5)]',
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
    hoverShadow: 'hover:shadow-[0_10px_30px_rgba(45,212,191,0.5)]',
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
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
