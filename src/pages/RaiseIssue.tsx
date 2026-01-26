import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { RaiseIssueForm } from '../components/RaiseIssueForm';

export const RaiseIssuePage: React.FC = () => {
  return (
    <div className="w-full">
      <PageHeader title="Raise an Issue" subtitle="Submit a community issue for review" />
      <section className="py-12 sm:py-16 bg-blue-50 border-b border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RaiseIssueForm />
        </div>
      </section>
    </div>
  );
};
