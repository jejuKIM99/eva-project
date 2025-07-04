// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gxjznorcwnqajdotlmxv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4anpub3Jjd25xYWpkb3RsbXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mzc2MjIsImV4cCI6MjA2MzIxMzYyMn0.kuOuJzp-DcDDEIfQ3sMZDi0b0447U_VCQrWZcj-UWsE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);