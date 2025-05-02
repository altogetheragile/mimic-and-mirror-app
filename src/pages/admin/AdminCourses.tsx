
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Users } from "lucide-react";
import { format } from "date-fns";
import { getAllCourses, deleteCourse } from "@/services/courseService";

const AdminCourses = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const { data: courses = [], refetch } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: getAllCourses,
  });

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Button asChild>
          <Link to="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" /> New Course
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.category || "-"}</TableCell>
                <TableCell>{course.level ? <span className="capitalize">{course.level}</span> : "-"}</TableCell>
                <TableCell>{course.price ? `$${course.price}` : "-"}</TableCell>
                <TableCell>
                  {course.start_date 
                    ? format(new Date(course.start_date), "MMM d, yyyy") 
                    : "-"
                  }
                </TableCell>
                <TableCell>
                  {course.is_published ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/courses/${course.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/courses/${course.id}/registrations`} title="View registrations">
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteClick(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
