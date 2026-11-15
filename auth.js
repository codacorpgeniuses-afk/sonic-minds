// auth.js - Updated for Supabase

// Change this to your exact admin email
const ADMIN_EMAIL = "yungchidex333@gmail.com";

// Protects member pages (Courses, Downloads, etc.)
async function enforcePaywall() {
    const email = localStorage.getItem('currentLoggedInEmail');
    
    if (!email) {
        alert("Access Denied: You are not logged in.");
        window.location.href = "index.html";
        return;
    }

    // Check from Supabase if user has paid
    const { data: user, error } = await supabase
        .from('users')
        .select('has_paid')
        .eq('email', email.toLowerCase())
        .single();

    if (error || !user || !user.has_paid) {
        alert("Access Denied: Your payment has not been verified yet.");
        window.location.href = "index.html";
    }
}

// Protects the Admin Panel
function enforceAdminAccess() {
    const currentUserEmail = localStorage.getItem('currentLoggedInEmail');

    if (!currentUserEmail || currentUserEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        alert("Access Denied: Admins only.");
        window.location.href = "index.html";
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem('currentLoggedInEmail');
    window.location.href = "index.html";
}

// Optional: Simple logout used in the navbar
function logout() {
    logoutUser();
}
