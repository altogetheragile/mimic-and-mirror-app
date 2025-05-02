
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Check, ChevronLeft, Eye, Search, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  waitlist: "bg-blue-100 text-blue-800 border-blue-300",
};

const paymentStatusColors = {
  unpaid: "bg-red-100 text-red-800 border-red-300",
  "partially-paid": "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-green-100 text-green-800 border-green-300",
  refunded: "bg-gray-100 text-gray-800 border-gray-300",
};

interface CourseRegistration {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    company?: string;
    is_group_registration?: boolean;
  };
}

interface RegistrationWithUser extends CourseRegistration {
  user?: {
    email: string;
    profile?: {
      first_name: string;
      last_name: string;
    };
  };
}

interface CourseDetails {
  id: string;
  title: string;
  start_date: string;
  capacity: number | null;
}

const AdminCourseRegistrations = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithUser | null>(null);
  const [viewRegistrationDetails, setViewRegistrationDetails] = useState(false);
  const queryClient = useQueryClient();

  // Fetch course details
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, start_date, capacity")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data as CourseDetails;
    },
  });

  // Fetch registrations
  const {
    data: registrations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course-registrations", courseId],
    queryFn: async () => {
      // Get regular registrations with user details
      const { data: regularData, error: regularError } = await supabase
        .from("course_registrations")
        .select(
          `
          *,
          user:user_id (
            email,
            profile:profiles (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("course_id", courseId);

      if (regularError) throw regularError;

      return regularData as RegistrationWithUser[];
    },
  });

  // Update registration status
  const updateRegistrationMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      paymentStatus,
    }: {
      id: string;
      status?: string;
      paymentStatus?: string;
    }) => {
      const updates: { status?: string; payment_status?: string } = {};
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;

      const { data, error } = await supabase
        .from("course_registrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-registrations", courseId] });
      toast({
        title: "Registration updated",
        description: "The registration status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete registration
  const deleteRegistrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_registrations").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-registrations", courseId] });
      toast({
        title: "Registration deleted",
        description: "The registration has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter((registration) => {
    const searchLower = searchTerm.toLowerCase();

    // For group registrations, search in metadata
    if (registration.metadata?.is_group_registration) {
      const companyName = registration.metadata.company || "";
      const participantName = `${registration.metadata.first_name} ${registration.metadata.last_name}`;
      const participantEmail = registration.metadata.email || "";

      return (
        companyName.toLowerCase().includes(searchLower) ||
        participantName.toLowerCase().includes(searchLower) ||
        participantEmail.toLowerCase().includes(searchLower)
      );
    }

    // For individual registrations
    const userName = registration.user
      ? `${registration.user.profile?.first_name || ""} ${
          registration.user.profile?.last_name || ""
        }`
      : "";
    const userEmail = registration.user?.email || "";

    return userName.toLowerCase().includes(searchLower) || userEmail.toLowerCase().includes(searchLower);
  });

  if (courseLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading course details</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/admin/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  // Display name for a registration
  const getRegistrationName = (registration: RegistrationWithUser) => {
    if (registration.metadata?.is_group_registration) {
      return `${registration.metadata.first_name} ${registration.metadata.last_name}`;
    }

    if (registration.user?.profile) {
      return `${registration.user.profile.first_name} ${registration.user.profile.last_name}`;
    }

    return "Unknown";
  };

  // Display email for a registration
  const getRegistrationEmail = (registration: RegistrationWithUser) => {
    if (registration.metadata?.is_group_registration) {
      return registration.metadata.email || "No email";
    }

    return registration.user?.email || "No email";
  };

  // Count of registrations by status
  const getStatusCounts = () => {
    return registrations.reduce(
      (acc, reg) => {
        if (reg.status) {
          acc[reg.status] = (acc[reg.status] || 0) + 1;
        } else {
          acc.undefined = (acc.undefined || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" asChild>
            <Link to="/admin/courses">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
        
        <Button variant="outline" asChild>
          <Link to={`/admin/course-templates`}>
            View Templates
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">
          Start date: {new Date(course.start_date).toLocaleDateString()}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            {course.capacity && (
              <p className="text-xs text-muted-foreground">
                of {course.capacity} capacity (
                {course.capacity > 0
                  ? Math.round((registrations.length / course.capacity) * 100)
                  : 0}
                % filled)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.confirmed || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.cancelled || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registrations by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="ml-4">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Registration
        </Button>
      </div>

      {/* Registrations table */}
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
          <CardDescription>Manage course registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">Error loading registrations</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No registrations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {getRegistrationName(registration)}
                    </TableCell>
                    <TableCell>{getRegistrationEmail(registration)}</TableCell>
                    <TableCell>
                      {registration.metadata?.is_group_registration ? (
                        <Badge variant="outline">Group</Badge>
                      ) : (
                        <Badge variant="outline">Individual</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={registration.status || "pending"}
                        onValueChange={(value) =>
                          updateRegistrationMutation.mutate({
                            id: registration.id,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="waitlist">Waitlist</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={registration.payment_status || "unpaid"}
                        onValueChange={(value) =>
                          updateRegistrationMutation.mutate({
                            id: registration.id,
                            paymentStatus: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="partially-paid">Partial</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setViewRegistrationDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <X className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this registration? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteRegistrationMutation.mutate(registration.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Registration details dialog */}
      {selectedRegistration && (
        <Dialog open={viewRegistrationDetails} onOpenChange={setViewRegistrationDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
              <DialogDescription>
                Complete information about this registration
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h3 className="font-medium">Participant Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Name:</div>
                  <div>{getRegistrationName(selectedRegistration)}</div>
                  <div className="font-medium">Email:</div>
                  <div>{getRegistrationEmail(selectedRegistration)}</div>
                  {selectedRegistration.metadata?.is_group_registration && (
                    <>
                      <div className="font-medium">Company:</div>
                      <div>{selectedRegistration.metadata.company || "N/A"}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="font-medium">Registration Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Status:</div>
                  <div>
                    <Badge
                      variant="outline"
                      className={selectedRegistration.status && statusColors[selectedRegistration.status as keyof typeof statusColors]}
                    >
                      {selectedRegistration.status || "pending"}
                    </Badge>
                  </div>
                  <div className="font-medium">Payment Status:</div>
                  <div>
                    <Badge
                      variant="outline"
                      className={selectedRegistration.payment_status && paymentStatusColors[selectedRegistration.payment_status as keyof typeof paymentStatusColors]}
                    >
                      {selectedRegistration.payment_status || "unpaid"}
                    </Badge>
                  </div>
                  <div className="font-medium">Registration Date:</div>
                  <div>
                    {new Date(selectedRegistration.created_at).toLocaleDateString()}
                  </div>
                  <div className="font-medium">Last Updated:</div>
                  <div>
                    {new Date(selectedRegistration.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Notes section could be added here */}
              <div className="grid gap-2">
                <h3 className="font-medium">Notes</h3>
                <Textarea
                  placeholder="Add notes about this registration"
                  className="resize-none h-20"
                />
                <Button variant="secondary" className="w-full">
                  <Check className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminCourseRegistrations;
