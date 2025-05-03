
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
export const supabase = createClient(
  'https://rhjucbgwipmmiisskmcz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoanVjYmd3aXBtbWlpc3NrbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTMyMzcsImV4cCI6MjA2MTQ4OTIzN30.NjLXJLrParqrcUSTnAVUKRN6RTswsLrKXyXP9Badn9M',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabase;
