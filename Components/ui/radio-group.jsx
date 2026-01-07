import React from 'react';
import { cn } from './utils';

const RadioGroup = ({ value, onValueChange, className, children, ...props }) => {
  return (
    <div className={cn('grid gap-2', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedValue: value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = ({ value: itemValue, selectedValue, onValueChange, id, className, ...props }) => {
  return (
    <input
      type="radio"
      id={id}
      checked={selectedValue === itemValue}
      onChange={() => onValueChange?.(itemValue)}
      className={cn('h-4 w-4 border-gray-300 text-black focus:ring-2 focus:ring-black', className)}
      {...props}
    />
  );
};

export { RadioGroup, RadioGroupItem };

