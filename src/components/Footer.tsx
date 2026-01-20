import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Disclaimer */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle size={20} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-semibold text-slate-50 mb-2">
                  Disclaimer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This platform documents publicly available concerns and allegations. It is not a court
                  of law. All stakeholders are invited to respond with evidence. Information should be
                  independently verified.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-slate-50 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-slate-100 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/evidence" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Evidence
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-slate-50 mb-4">
              Get In Touch
            </h3>
            <a
              href="mailto:info@bakwenabamogopa.org"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 transition-colors text-sm"
            >
              <Mail size={16} />
              info@bakwenabamogopa.org
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-400 text-center">
            © {currentYear} Hebron Accountability Platform – Bakwena ba Mogopa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
