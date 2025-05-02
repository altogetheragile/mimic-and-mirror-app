
import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface AdminNavLinkProps extends NavLinkProps {
  icon?: LucideIcon;
  children: React.ReactNode;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({
  icon: Icon,
  children,
  className,
  ...props
}) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start gap-2",
          isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
          className
        )
      }
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </NavLink>
  );
};

export default AdminNavLink;
