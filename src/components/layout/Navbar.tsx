import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const NavBar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role;

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {/* Other common links */}
      {role === 'admin' && <Link to="/admin">Admin</Link>}
    </nav>
  );
};

export default NavBar;
