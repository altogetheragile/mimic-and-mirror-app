
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X, Search, Filter, Mail, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Registration {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  email: string;
  profile?: {
    first_name: string;
    last_name: string;
  };
}

interface RegistrationWithUser extends Registration {
  user: User;
  course: {
    title: string;
    start_date: string;
  };
}

interface Course {
  id: string;
  title: string;
}

const AdminCourseRegistrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<string | null>(null);

  // Fetch registrations with user and course data
  const { data: registrations = [], isLoading: isLoadingRegistrations, refetch } = useQuery({
    queryKey: ["courseRegistrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_registrations")
        .select(`
          *,
          profiles:user_id(first_name, last_name),
          courses:course_id(title, start_date)
        `);

      if (error) {
        throw error;
      }

      // Transform the data to match the expected format
      const transformedData: RegistrationWithUser[] = (data || []).map((reg: any) => {
        return {
          ...reg,
          user: {
            email: reg.email || "Unknown",
            profile: {
              first_name: reg.profiles?.first_name || "",
              last_name: reg.profiles?.last_name || "",
            }
          },
          course: reg.courses || { title: "Unknown course", start_date: null }
        };
      });

      return transformedData;
    },
  });

  // Fetch all courses for filtering
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .order("title");

      if (error) {
        throw error;
      }

      return data as Course[];
    },
  });

  // Filter registrations based on search term and filters
  const filteredRegistrations = registrations.filter((reg) => {
    const fullName = `${reg.user.profile?.first_name || ""} ${reg.user.profile?.last_name || ""}`.toLowerCase();
    const searchMatch = !searchTerm || 
                      fullName.includes(searchTerm.toLowerCase()) || 
                      reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      reg.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
                      
    const statusMatch = !statusFilter || reg.status === statusFilter;
    const courseMatch = !courseFilter || reg.course_id === courseFilter;
    
    return searchMatch && statusMatch && courseMatch;
  });

  // Update registration status
  const updateRegistrationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("course_registrations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Registration status changed to ${status}`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Update payment status
  const updatePaymentStatus = async (id: string, payment_status: string) => {
    try {
      const { error } = await supabase
        .from("course_registrations")
        .update({ payment_status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Payment status updated",
        description: `Payment status changed to ${payment_status}`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  // Send confirmation email to user
  const sendConfirmationEmail = async (registration: RegistrationWithUser) => {
    toast({
      title: "Sending email",
      description: `Sending confirmation to ${registration.user.email}...`,
    });
    
    // In a real app, you'd call an Edge Function to send an email
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: `Confirmation email sent to ${registration.user.email}`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Course Registrations</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registrations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="attended">Attended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={courseFilter || ""} onValueChange={(value) => setCourseFilter(value || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
          <CardDescription>
            Manage course registrations and participant statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRegistrations ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {registration.user.profile?.first_name} {registration.user.profile?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{registration.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{registration.course?.title || "Unknown course"}</p>
                            {registration.course?.start_date && (
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <CalendarClock className="h-3 w-3 mr-1" />
                                {format(new Date(registration.course.start_date), "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(registration.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={registration.status} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={registration.payment_status} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Registration Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => sendConfirmationEmail(registration)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Confirmation
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "pending")}>
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "confirmed")}>
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                Mark as Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "cancelled")}>
                                <X className="h-4 w-4 mr-2 text-red-500" />
                                Mark as Cancelled
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "attended")}>
                                <Check className="h-4 w-4 mr-2 text-blue-500" />
                                Mark as Attended
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Payment</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updatePaymentStatus(registration.id, "pending")}>
                                Mark as Payment Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePaymentStatus(registration.id, "completed")}>
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePaymentStatus(registration.id, "failed")}>
                                <X className="h-4 w-4 mr-2 text-red-500" />
                                Mark as Payment Failed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No registrations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case "confirmed":
      return <Badge variant="default">Confirmed</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "attended":
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Attended</Badge>;
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
};

// Payment status badge component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Paid</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
    case "failed":
      return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Failed</Badge>;
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
};

export default AdminCourseRegistrations;
