'use client';

import React, { useState } from 'react';

// SVG Icons
const CheckIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const CircleIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
  </svg>
);

interface StatusChipProps {
  status: 'Present' | 'Not Arrived' | 'Checked Out';
  onStatusChange?: (newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  interactive?: boolean;
}

export default function StatusChip({ 
  status, 
  onStatusChange, 
  isLoading = false, 
  disabled = false,
  size = 'md',
  showIcon = true,
  interactive = true
}: StatusChipProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Present':
        return {
          color: 'bg-green-500/20 text-green-300 border-green-400/30',
          hoverColor: interactive ? 'hover:bg-green-500/30 hover:border-green-400/50' : '',
          icon: <CheckIcon />,
          label: 'Present',
          nextStatus: 'Checked Out' as const
        };
      case 'Checked Out':
        return {
          color: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
          hoverColor: interactive ? 'hover:bg-orange-500/30 hover:border-orange-400/50' : '',
          icon: <CrossIcon />,
          label: 'Checked Out',
          nextStatus: 'Present' as const
        };
      case 'Not Arrived':
      default:
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
          hoverColor: interactive ? 'hover:bg-gray-500/30 hover:border-gray-400/50' : '',
          icon: <CircleIcon />,
          label: 'Not Arrived',
          nextStatus: 'Present' as const
        };
    }
  };

  const getSizeClasses = (chipSize: string) => {
    switch (chipSize) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      case 'md':
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  const handleStatusToggle = async () => {
    if (!interactive || !onStatusChange || disabled || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusChange(config.nextStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const isClickable = interactive && onStatusChange && !disabled && !isUpdating;

  return (
    <button
      onClick={handleStatusToggle}
      disabled={!isClickable}
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200
        ${sizeClasses}
        ${config.color}
        ${isClickable ? config.hoverColor : ''}
        ${isClickable ? 'cursor-pointer transform hover:scale-105' : 'cursor-default'}
        ${(isLoading || isUpdating) ? 'opacity-70' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black
      `}
      title={isClickable ? `Click to change to ${config.nextStatus}` : config.label}
      aria-label={`Status: ${config.label}${isClickable ? '. Click to change.' : ''}`}
    >
      {(isLoading || isUpdating) ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        showIcon && config.icon
      )}
      <span>{config.label}</span>
    </button>
  );
}