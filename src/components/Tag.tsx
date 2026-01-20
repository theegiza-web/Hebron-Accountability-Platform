import React from 'react';

interface TagProps {
  label: string;
  variant?: 'default' | 'subtle';
}

export const Tag: React.FC<TagProps> = ({ label, variant = 'default' }) => {
  const baseStyles =
    'inline-block px-3 py-1 text-sm rounded-full font-medium transition-colors';
  const variantStyles = {
    default: 'bg-slate-200 text-slate-800',
    subtle: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]}`}>
      {label}
    </span>
  );
};
