import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface RoleBasedRenderProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role;

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleBasedRender;
