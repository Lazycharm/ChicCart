import React from 'react';
import { cn } from './utils';

const Slider = React.forwardRef(({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (Array.isArray(value)) {
      // Handle range slider
      const [min, max] = value;
      if (e.target.name === 'min') {
        onValueChange?.([newValue, max]);
      } else {
        onValueChange?.([min, newValue]);
      }
    } else {
      onValueChange?.([newValue]);
    }
  };

  if (Array.isArray(value) && value.length === 2) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          name="min"
          className="flex-1"
          ref={ref}
          {...props}
        />
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value[1]}
          onChange={handleChange}
          name="max"
          className="flex-1"
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type="range"
      min="0"
      max={max}
      step={step}
      value={Array.isArray(value) ? value[0] : value}
      onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
      className={cn('w-full', className)}
      ref={ref}
      {...props}
    />
  );
});

Slider.displayName = 'Slider';

export { Slider };

