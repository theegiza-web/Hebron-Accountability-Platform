import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
