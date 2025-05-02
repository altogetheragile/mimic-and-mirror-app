
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Users,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { courseRegistrationService } from "@/lib/api/courseRegistration";
import { toast } from "@/components/ui/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

type StatusFilterType = "all" | "pending" | "confirmed" | "cancelled";
type PaymentFilterType = "all" | "paid" | "unpaid" | "refunded";

const AdminCourseRegistrations = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilterType>("all");
  
  const queryClient = useQueryClient();

  // Fetch course info
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseId ? ({ data: { title: "Course Title", start_date: new Date().toISOString() } }) : null,
    enabled: !!courseId,
  });

  // Fetch registrations
  const { data: registrations = [], isLoading: registrationsLoading } = useQuery({
    queryKey: ["courseRegistrations", courseId, statusFilter, paymentFilter, searchTerm],
    queryFn: () => courseId ? 
      courseRegistrationService.getRegistrationsForCourse(courseId)
      .then(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }) : [],
    enabled: !!courseId,
  });

  // Update registration status
  const updateStatusMutation = useMutation({
    mutationFn: ({ registrationId, status, paymentStatus }: { 
      registrationId: string, 
      status: string,
      paymentStatus?: string 
    }) => {
      return courseRegistrationService.updateRegistrationStatus(
        registrationId, 
        status,
        paymentStatus
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"] });
    },
  });

  // Filter registrations based on search and filters
  const filteredRegistrations = registrations.filter((reg: any) => {
    // Status filter
    if (statusFilter !== "all" && reg.status !== statusFilter) {
      return false;
    }

    // Payment filter
    if (paymentFilter !== "all" && reg.payment_status !== paymentFilter) {
      return false;
    }

    // Search term
    if (searchTerm) {
      const metadata = reg.metadata || {};
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = `${metadata.first_name || ''} ${metadata.last_name || ''}`.toLowerCase().includes(searchLower);
      const emailMatch = metadata.email?.toLowerCase().includes(searchLower);
      const companyMatch = metadata.company?.toLowerCase().includes(searchLower);
      
      if (!nameMatch && !emailMatch && !companyMatch) {
        return false;
      }
    }

    return true;
  });

  // Handle status update
  const handleStatusUpdate = (registrationId: string, status: string, paymentStatus?: string) => {
    updateStatusMutation.mutate({ 
      registrationId, 
      status, 
      paymentStatus 
    }, {
      onSuccess: () => {
        toast({
          title: "Status updated",
          description: `Registration status has been updated to ${status}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Update failed",
          description: error.message || "Failed to update registration status",
          variant: "destructive",
        });
      },
    });
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      case "unpaid":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus || "Unknown"}</Badge>;
    }
  };

  return (
    <div className="container py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/admin/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/admin/courses">Courses</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Registrations</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Button variant="outline" asChild className="mb-4">
            <Link to="/admin/courses">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Link>
          </Button>
          
          {courseLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{course?.data?.title || "Course"} - Registrations</h1>
              {course?.data?.start_date && (
                <p className="text-sm text-muted-foreground">
                  Course date: {format(new Date(course.data.start_date), "MMMM d, yyyy")}
                </p>
              )}
            </>
          )}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex gap-4 items-center">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">Total Registrations</p>
              <p className="text-2xl font-bold">
                {registrationsLoading ? <Skeleton className="h-8 w-16" /> : filteredRegistrations.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Registrations</CardTitle>
          <CardDescription>
            Manage and update the status of participant registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or company"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterType)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value as PaymentFilterType)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {registrationsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 flex-grow" />
                </div>
              ))}
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration: any) => {
                    const metadata = registration.metadata || {};
                    return (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          {metadata.first_name || ''} {metadata.last_name || ''}
                        </TableCell>
                        <TableCell>
                          <div>{metadata.email || ''}</div>
                          <div className="text-sm text-muted-foreground">{metadata.phone || ''}</div>
                        </TableCell>
                        <TableCell>{metadata.company || '-'}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                        <TableCell>{getPaymentBadge(registration.payment_status)}</TableCell>
                        <TableCell>
                          {registration.created_at && format(new Date(registration.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {registration.status !== "confirmed" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                title="Confirm registration"
                                onClick={() => handleStatusUpdate(registration.id, "confirmed")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {registration.status !== "cancelled" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-destructive text-destructive"
                                title="Cancel registration"
                                onClick={() => handleStatusUpdate(registration.id, "cancelled")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {registration.payment_status === "unpaid" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-green-600 text-green-600"
                                title="Mark as paid"
                                onClick={() => handleStatusUpdate(registration.id, registration.status, "paid")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No registrations found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all" ? 
                  "Try adjusting your search or filters" : 
                  "This course doesn't have any registrations yet"}
              </p>
              {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPaymentFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourseRegistrations;
