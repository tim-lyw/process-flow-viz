import { ReactNode } from 'react';
import { ChartWrapperProps } from '../../types';

/**
 * A wrapper for chart components that displays a title and description
 */
function ChartWrapper({ title, description, children, className = '' }: ChartWrapperProps) {
  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      {children}
    </div>
  );
}

export default ChartWrapper; 