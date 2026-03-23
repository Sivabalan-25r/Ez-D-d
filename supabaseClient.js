const supabaseUrl = 'https://nndivhbpkciwbspyadho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGl2aGJwa2Npd2JzcHlhZGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTc0NDAsImV4cCI6MjA4OTg3MzQ0MH0.Pu3uLp45Wh-7hgAyyzzuqFghTuB60VWekFQKKdb6BDo';
const _supabase = typeof supabase !== 'undefined' ? supabase.createClient(supabaseUrl, supabaseKey) : null;
