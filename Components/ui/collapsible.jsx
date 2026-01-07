import React, { useState } from 'react';
import { cn } from './utils';
import { ChevronDown } from 'lucide-react';

const Collapsible = ({ defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === CollapsibleTrigger) {
          return React.cloneElement(child, { open, setOpen });
        }
        if (child.type === CollapsibleContent) {
          return React.cloneElement(child, { open });
        }
        return child;
      })}
    </div>
  );
};

const CollapsibleTrigger = ({ open, setOpen, className, children, ...props }) => {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn('flex items-center justify-between w-full', className)}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
    </button>
  );
};

const CollapsibleContent = ({ open, className, children, ...props }) => {
  if (!open) return null;
  return (
    <div className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

