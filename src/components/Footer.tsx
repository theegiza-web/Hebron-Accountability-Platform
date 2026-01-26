import React from 'react';
import { AlertCircle, MessageCircle, Facebook } from 'lucide-react';

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
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <a href="/#/about" className="text-slate-300 hover:text-slate-100 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/#/evidence" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Evidence
                </a>
              </li>
              <li>
                <a href="/#/issues" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Issues
                </a>
              </li>
              <li>
                <a href="/#/responses" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Responses
                </a>
              </li>
              <li>
                <a href="/#/petition" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Petition
                </a>
              </li>
              <li>
                <a href="/#/petition-dashboard" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/#/contact" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/#/admin/issues" className="text-slate-300 hover:text-slate-100 transition-colors">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-slate-50 mb-4">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div>
                <div className="space-y-2 mb-4">
                  <div className="text-slate-300 text-sm">
                    <p className="font-semibold">Bethanie:</p>
                    <a href="tel:+27796586452" className="hover:text-slate-100 transition-colors">
                      079 658 6452
                    </a>
                  </div>
                  <div className="text-slate-300 text-sm">
                    <p className="font-semibold">Hebron:</p>
                    <a href="tel:+27734623287" className="hover:text-slate-100 transition-colors">
                      073 462 3287
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://chat.whatsapp.com/GQStodwtiUnBHibZzzUTaO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-green-400 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61587026570605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                    title="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <p className="text-sm text-slate-400 text-center">
            © {currentYear} Bakwena Ba Mogopa Region Accountability Platform. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 text-center mt-2">
            Platform developed by gISUS dev & Solutions · Community-first, open-source
          </p>
        </div>
      </div>
    </footer>
  );
};
