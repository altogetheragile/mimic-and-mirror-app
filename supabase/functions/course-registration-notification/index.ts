
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const { registration } = await req.json();
    
    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    
    // Get course details
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("title, start_date, location, price")
      .eq("id", registration.course_id)
      .single();
      
    if (courseError) throw courseError;
    
    // Get admin email from settings
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "contact_info")
      .single();
    
    const adminEmail = settings?.value?.email || "admin@example.com";
    
    // Format the registration data for emails
    const formattedDate = course.start_date 
      ? new Date(course.start_date).toLocaleDateString()
      : "TBD";
    
    // Store notification in database (optional)
    // This could be implemented if you want to track notifications
    
    console.log(`Course registration received for ${registration.first_name} ${registration.last_name}`);
    console.log(`Course: ${course.title}, Start: ${formattedDate}`);
    
    // In a real implementation, you would send an email here
    // using a service like SendGrid, Resend, etc.
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing course registration:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
