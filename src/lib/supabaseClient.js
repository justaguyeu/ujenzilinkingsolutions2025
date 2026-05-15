import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hmqzaswebmwkjmjrnmsd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcXphc3dlYm13a2ptanJubXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjkzNjAsImV4cCI6MjA5NDQwNTM2MH0.2Yh2LMdDgR5ReBdo6xb2WOLEz6kLAcLmQvrqagtRHcU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);