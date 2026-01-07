import React, { useState } from 'react';
import { cn } from './utils';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ type = 'single', collapsible = false, children, className }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const handleToggle = (value) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(value)) {
      if (collapsible) {
        newOpen.delete(value);
      }
    } else {
      if (type === 'single') {
        newOpen.clear();
      }
      newOpen.add(value);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {React.Children.map(children, (child) => {
        if (child.type === AccordionItem) {
          return React.cloneElement(child, { openItems, onToggle: handleToggle });
        }
        return child;
      })}
    </div>
  );
};

const AccordionItem = ({ value, openItems, onToggle, className, children, ...props }) => {
  const isOpen = openItems.has(value);
  return (
    <div className={cn('border-b', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === AccordionTrigger) {
          return React.cloneElement(child, { isOpen, onClick: () => onToggle(value) });
        }
        if (child.type === AccordionContent) {
          return React.cloneElement(child, { isOpen });
        }
        return child;
      })}
    </div>
  );
};

const AccordionTrigger = ({ isOpen, onClick, className, children, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex w-full items-center justify-between py-4 font-medium transition-all hover:underline', className)}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );
};

const AccordionContent = ({ isOpen, className, children, ...props }) => {
  if (!isOpen) return null;
  return (
    <div className={cn('overflow-hidden text-sm transition-all', className)} {...props}>
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

