const SUPABASE_URL = "https://swnivudsoztvtltlkfna.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bml2dWRzb3p0dnRsdGxrZm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTU0ODEsImV4cCI6MjA5NzU5MTQ4MX0.XQicAb-784UgO6W8475QoPAUo99mGLp9iLbcNYAnwpc";

window.BACONCAKE_SUPABASE = {
  anonKey: SUPABASE_ANON_KEY,
  authUrl: `${SUPABASE_URL}/auth/v1`,
  restUrl: `${SUPABASE_URL}/rest/v1`,
  storageUrl: `${SUPABASE_URL}/storage/v1`,
};
