import React from 'react';

/**
 * ResponsiveTable - Wraps tables to make them horizontally scrollable on mobile
 */
export default function ResponsiveTable({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg lg:rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto -mx-0 lg:mx-0">
        <div className="inline-block min-w-full align-middle">
          {children}
        </div>
      </div>
    </div>
  );
}

