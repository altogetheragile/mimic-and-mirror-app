
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, Copy, CalendarPlus } from "lucide-react";
import { 
  getAllCourseTemplates, 
  deleteCourseTemplate,
  createCourseFromTemplate
} from "@/services/courseTemplateService";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const AdminCourseTemplates = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToSchedule, setTemplateToSchedule] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [isPublishing, setIsPublishing] = useState(false);

  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["courseTemplates"],
    queryFn: getAllCourseTemplates,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourseTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseTemplates"] });
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete template",
        description: error.message || "An error occurred while deleting the template",
        variant: "destructive",
      });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!templateToSchedule || !startDate) return null;

      setIsPublishing(true);
      try {
        return await createCourseFromTemplate(templateToSchedule, {
          start_date: startDate.toISOString(),
          end_date: endDate?.toISOString(),
          location,
          capacity: capacity,
          is_published: true,
        });
      } finally {
        setIsPublishing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      setScheduleDialogOpen(false);
      resetScheduleForm();
      
      if (data) {
        toast({
          title: "Course scheduled",
          description: `${data.title} has been scheduled and published.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to schedule course",
        description: error.message || "An error occurred while scheduling the course",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteDialogOpen(true);
  };

  const handleScheduleClick = (templateId: string) => {
    setTemplateToSchedule(templateId);
    setScheduleDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteMutation.mutate(templateToDelete);
    }
  };

  const scheduleFromTemplate = () => {
    scheduleMutation.mutate();
  };

  const resetScheduleForm = () => {
    setTemplateToSchedule(null);
    setStartDate(new Date());
    setEndDate(undefined);
    setLocation("");
    setCapacity(undefined);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Templates</h1>
        <Button asChild>
          <Link to="/admin/course-templates/new">
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 bg-muted rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <Copy className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Course Templates</h3>
            <p className="text-muted-foreground mb-6">
              Create your first course template to quickly schedule recurring courses.
            </p>
            <Button asChild>
              <Link to="/admin/course-templates/new">
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: template.image_url
                    ? `url(${template.image_url})`
                    : "url(/placeholder.svg)",
                }}
              />
              <CardHeader>
                <CardTitle className="truncate">{template.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {template.description || "No description available"}
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {template.category && (
                    <div className="text-sm">
                      <span className="font-medium">Category:</span> {template.category}
                    </div>
                  )}
                  {template.level && (
                    <div className="text-sm">
                      <span className="font-medium">Level:</span>{" "}
                      <span className="capitalize">{template.level}</span>
                    </div>
                  )}
                  {template.price && (
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> ${template.price}
                    </div>
                  )}
                  {template.duration && (
                    <div className="text-sm">
                      <span className="font-medium">Duration:</span> {template.duration} hours
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScheduleClick(template.id)}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" /> Schedule Course
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/course-templates/${template.id}`}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Course Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Course from Template</DialogTitle>
            <DialogDescription>
              Enter the details for the new course instance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Virtual or Office Address"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity (Optional)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity || ""}
                onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Maximum number of participants"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={scheduleFromTemplate} disabled={!startDate || isPublishing}>
              {isPublishing ? "Creating..." : "Create & Publish Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseTemplates;
