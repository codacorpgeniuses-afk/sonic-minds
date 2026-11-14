// auth.js - Secure gatekeeper for protected pages and admin panel

// CHANGE THIS to your exact personal email address
const ADMIN_EMAIL = "yungchidex333@gmail.com";
const ADMIN_PASSWORD = "C0NQU3R0R";

// Protects member pages (Courses, Downloads)
function enforcePaywall() {
    const currentUserEmail = localStorage.getItem('currentLoggedInEmail');
    const allUsers = JSON.parse(localStorage.getItem('allSiteUsers')) || [];
    const user = allUsers.find(u => u.email === currentUserEmail);

    if (!user || !user.hasPaid) {
        alert("Access Denied: Your payment has not been verified yet or you are not logged in.");
        window.location.href = "index.html";
    }
}

// Protects the Admin Panel (Only allows ADMIN_EMAIL)
function enforceAdminAccess() {
    const currentUserEmail = localStorage.getItem('currentLoggedInEmail');

    if (currentUserEmail !== ADMIN_EMAIL) {
        alert("Access Denied: Admins only.");
        window.location.href = "index.html";
    }
}

function logoutUser() {
    localStorage.removeItem('currentLoggedInEmail');
    window.location.href = "index.html";
}