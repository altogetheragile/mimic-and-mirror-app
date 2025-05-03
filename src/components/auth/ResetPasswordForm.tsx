
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract hash parameters from the URL
  const getHashParams = () => {
    // Handle both hash parameters and query parameters
    const hash = location.hash.substring(1); // Remove the leading #
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(location.search);

    // Try to get access token from either hash or query params
    const accessToken = 
      hashParams.get('access_token') || 
      queryParams.get('access_token');
    
    return {
      accessToken,
      type: hashParams.get('type') || queryParams.get('type')
    };
  };

  const { accessToken } = getHashParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (!accessToken) {
        throw new Error("No access token found. Please request a new password reset link.");
      }

      console.log("Attempting to reset password with token:", accessToken);

      // Set the session using the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '', // We don't have a refresh token in this case
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        console.error("Update password error:", error);
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast({
        title: "Reset failed",
        description: error.message || "Failed to update password. The reset link may have expired. Please request a new one.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
