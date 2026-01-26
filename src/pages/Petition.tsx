import React from "react";
import { PageHeader } from "../components/PageHeader";
import { Link } from "react-router-dom";
import { PetitionSignatures } from "../components/PetitionSignatures";
import { PETITION_FEED_URL } from "../config";

const FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe9XYsBWwn6newD9TeF1VgtHM3V35xe-DV-bTH7J6JwUaxOcA/viewform?embedded=true";

export const PetitionPage: React.FC = () => {
  return (
    <>
      {/* Petition Form */}
      <div className="w-full">
        <PageHeader
          title="Petition"
          subtitle="Add your support for transparency, accountability, and proper governance"
        />

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <iframe
                title="Petition form"
                src={FORM_EMBED_URL}
                className="w-full h-[85vh]"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
              />
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-6">
              If the form does not load, open it in a new tab:&nbsp;
              <a
                href={FORM_EMBED_URL.replace("?embedded=true", "")}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-slate-900"
              >
                View form
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Embedded Dashboard */}
      <section className="py-14 sm:py-18 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Live Dashboard
              </h2>
              <p className="text-slate-600">
                Recent signatures (privacy-protected).
              </p>
            </div>

            <Link
              to="/petition-dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 text-white
                         hover:bg-slate-800 transition-colors"
            >
              Open full dashboard
            </Link>
          </div>

          <PetitionSignatures feedUrl={PETITION_FEED_URL} compact />
        </div>
      </section>
    </>
  );
};
