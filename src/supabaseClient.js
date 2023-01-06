import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://vpvrvpxpwwwdywjxmwho.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdnJ2cHhwd3d3ZHl3anhtd2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4Nzc3MzIsImV4cCI6MTk4ODQ1MzczMn0.BKxtPlXs07LOfHSOUL0Z8GhG_HgG9LTNqoabkBG-IfM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)