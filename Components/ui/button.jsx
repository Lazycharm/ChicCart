import React from 'react';
import { cn } from './utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, asChild, ...props }, ref) => {
  const variants = {
    default: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };

  // Filter out asChild prop to prevent React warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { asChild: _unused, ...buttonProps } = { asChild, ...props };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };

