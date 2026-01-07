import React from 'react';
import { cn } from './utils';
import { X } from 'lucide-react';

const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => {
  const sides = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'fixed z-50 h-full w-3/4 border-r bg-white p-6 shadow-lg transition-transform sm:max-w-sm',
        sides[side],
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
});

const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold text-gray-900', className)} {...props} />
));

const SheetTrigger = React.forwardRef(({ asChild, className, children, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, { ref, ...props });
  }
  return (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  );
});

SheetContent.displayName = 'SheetContent';
SheetTitle.displayName = 'SheetTitle';
SheetTrigger.displayName = 'SheetTrigger';

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger };

