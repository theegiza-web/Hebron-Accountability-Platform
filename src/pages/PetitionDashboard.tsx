import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { PetitionSignatures } from '../components/PetitionSignatures';
import { PETITION_FEED_URL } from '../config';

export const PetitionDashboardPage: React.FC = () => {
  return (
    <div className="w-full">
      <PageHeader title="Petition Signatures" subtitle="Public dashboard of signees (privacy-protected)" />

      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PetitionSignatures feedUrl={PETITION_FEED_URL} />
        </div>
      </section>
    </div>
  );
};
