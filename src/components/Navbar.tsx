import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Evidence', href: '/evidence' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Issues', href: '/issues' },
  { label: 'Strategy', href: '/strategy' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'Petition', href: '/petition' },
  { label: 'Dashboard', href: '/petition-dashboard' }

];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
  setIsOpen(false);
}, [location.key]);

  const isActive = (href: string) =>
  location.pathname === href || location.hash === `#${href}`;


  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 px-2 sm:px-0">
          {/* Logo with Icon */}
          <Link
            to="/"
            className="text-slate-900 hover:text-slate-700 transition-colors p-0"
          >
            <img
              src={`${import.meta.env.BASE_URL}downloads/icon.png`}
              alt="Bakwena ba Mogopa Logo"
              className="h-24 w-24 sm:h-24 sm:w-24 lg:h-26 md:h-24 md:w-24 lg:w-26 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200 bg-slate-50"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-slate-200 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
