
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  FileText,
  Image
} from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white p-4 md:min-h-screen border-r">
            <div className="mb-8 p-2">
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
            </div>
            
            <nav className="space-y-1">
              <NavItem to="/admin/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
                Dashboard
              </NavItem>
              <NavItem to="/admin/courses" icon={<BookOpen className="h-5 w-5" />}>
                Courses
              </NavItem>
              <NavItem to="/admin/users" icon={<Users className="h-5 w-5" />}>
                Users
              </NavItem>
              <NavItem to="/admin/testimonials" icon={<MessageSquare className="h-5 w-5" />}>
                Testimonials
              </NavItem>
              <NavItem to="/admin/blog" icon={<FileText className="h-5 w-5" />}>
                Blog Posts
              </NavItem>
              <NavItem to="/admin/media" icon={<Image className="h-5 w-5" />}>
                Media
              </NavItem>
              <NavItem to="/admin/settings" icon={<Settings className="h-5 w-5" />}>
                Settings
              </NavItem>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, children, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => 
      `flex items-center px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors
      ${isActive 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'text-gray-700'}`
    }
  >
    <span className="mr-3">{icon}</span>
    {children}
  </NavLink>
);

export default AdminLayout;
