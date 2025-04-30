
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, updateUserRole } from "@/services/userService";

const AdminUsers = () => {
  const { data: users = [], refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'instructor' | 'student') => {
    await updateUserRole(userId, newRole);
    refetch();
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                    : 'No name'
                  }
                </TableCell>
                <TableCell>{user.email || "Unknown"}</TableCell>
                <TableCell>
                  <Badge className={`
                    ${user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : user.role === 'instructor' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {user.role || "student"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role || "student"}
                    onValueChange={(value) => 
                      handleRoleChange(user.id, value as 'admin' | 'instructor' | 'student')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Change role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
