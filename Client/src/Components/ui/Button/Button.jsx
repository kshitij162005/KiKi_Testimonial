import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import './Button.css';

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary', 
  ghost: 'btn-ghost',
  destructive: 'btn-destructive'
};

const buttonSizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg'
};

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'btn-base',
        buttonVariants[variant],
        buttonSizes[size],
        {
          'btn-loading': loading,
          'btn-disabled': disabled
        },
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <Loader2 className="btn-spinner" />
      )}
      <span className={cn('btn-content', { 'btn-content-loading': loading })}>
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;