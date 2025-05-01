
import React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

const SafeComponent: React.FC<SafeComponentProps> = ({ 
  children, 
  fallback, 
  name = "component"
}) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default SafeComponent;
