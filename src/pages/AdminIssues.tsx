import React, { useState } from 'react';
import { AdminAuth } from '../components/AdminAuth';
import { AdminDashboard } from '../components/AdminDashboard';

export const AdminIssuesPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');

  const handleAuthenticated = (secret: string) => {
    setAdminSecret(secret);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminSecret('');
  };

  return isAuthenticated ? (
    <AdminDashboard secret={adminSecret} onLogout={handleLogout} />
  ) : (
    <AdminAuth onAuthenticated={handleAuthenticated} />
  );
};
