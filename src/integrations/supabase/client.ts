// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pmjrssmcyuyjxpvojmfk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtanJzc21jeXV5anhwdm9qbWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTAzNjksImV4cCI6MjA2NTA2NjM2OX0.5Op3LafYuybBnHZUbwbAs0h5Mvyv-5NXrDPLqx18dFU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);