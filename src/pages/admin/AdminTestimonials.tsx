
import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getAllTestimonials, deleteTestimonial, updateTestimonial } from "@/services/testimonialService";

const AdminTestimonials = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  const { data: testimonials = [], refetch } = useQuery({
    queryKey: ["adminTestimonials"],
    queryFn: getAllTestimonials,
  });

  const handleDeleteClick = (testimonialId: string) => {
    setTestimonialToDelete(testimonialId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (testimonialToDelete) {
      await deleteTestimonial(testimonialToDelete);
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
      refetch();
    }
  };

  const handlePublishedChange = async (testimonialId: string, published: boolean) => {
    await updateTestimonial(testimonialId, { published });
    refetch();
  };

  const handleFeaturedChange = async (testimonialId: string, isFeatured: boolean) => {
    await updateTestimonial(testimonialId, { is_featured: isFeatured });
    refetch();
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <Button asChild>
          <Link to="/admin/testimonials/new">
            <Plus className="mr-2 h-4 w-4" /> New Testimonial
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>{testimonial.company || "-"}</TableCell>
                <TableCell className="max-w-sm truncate">
                  {testimonial.content}
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={!!testimonial.published} 
                    onCheckedChange={(checked) => 
                      handlePublishedChange(testimonial.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={!!testimonial.is_featured} 
                    onCheckedChange={(checked) => 
                      handleFeaturedChange(testimonial.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/testimonials/${testimonial.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteClick(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No testimonials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
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

// Import Link in the file
import { Link } from "react-router-dom";

export default AdminTestimonials;
