
const SUPABASE_URL = "yqicyiflmkfujoqstqcc";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaWN5aWZsbWtmdWpvcXN0cWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2NTA1MzcsImV4cCI6MjExMDIyNjUzN30.fEhjL7XUGNv6iFCQqgYN-EloAsOvooC5MZay45GHQDk";

const ADMIN_EMAIL = "yungchidex333@gmail.com";

// Initialize Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Check logged-in user
async function getCurrentUser() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "index.html";
        return null;
    }

    return data.user;
}

// Protect paid pages
async function enforcePaywall() {
    const user = await getCurrentUser();

    if (!user) return;

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single();

    if (error || !data || data.has_paid !== true) {
        alert("Payment has not been verified. Please complete payment.");
        window.location.href = "index.html";
        return;
    }
}

// Protect admin panel
async function enforceAdminAccess() {
    const user = await getCurrentUser();

    if (!user) return;

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (
        error ||
        user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
        data?.role !== "admin"
    ) {
        alert("Access denied: Administrators only.");
        window.location.href = "index.html";
        return;
    }
}

// Logout
async function logoutUser() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}
