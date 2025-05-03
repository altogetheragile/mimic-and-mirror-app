
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/error/ErrorBoundary";

// Pages
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCourseRegistrations from "@/pages/admin/AdminCourseRegistrations";
import AdminCourseTemplates from "@/pages/admin/AdminCourseTemplates";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminMedia from "@/pages/admin/AdminMedia";

// Create a client for React Query with some defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <SiteSettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseSlug" element={<CourseDetail />} />
                  
                  {/* Services Routes */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:serviceSlug" element={<ServiceDetail />} />
                  
                  {/* Protected Routes - User */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Redirect from /my-courses to /dashboard */}
                    <Route path="/my-courses" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                  
                  {/* Special route for admin that redirects to /admin/dashboard */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <Navigate to="/admin/dashboard" replace />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Routes - Admin */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="courses/:courseId/registrations" element={<AdminCourseRegistrations />} />
                    <Route path="course-templates" element={<AdminCourseTemplates />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="media" element={<AdminMedia />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
