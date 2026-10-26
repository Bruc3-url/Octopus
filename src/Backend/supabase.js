import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzfmympwpwkylmjcpkcf.supabase.co';
const supabaseAnonKey = 'sb_publishable_ImZIMQG86aM6oY7bNFkjDA_JpHmO8cA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);