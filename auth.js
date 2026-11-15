
// SONIC MINDS - PASSCODE AUTHENTICATION

const SUPABASE_URL = "yqicyiflmkfujoqstqcc";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaWN5aWZsbWtmdWpvcXN0cWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2NTA1MzcsImV4cCI6MjExMDIyNjUzN30.fEhjL7XUGNv6iFCQqgYN-EloAsOvooC5MZay45GHQDk";

const sonicDB = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Generate a permanent browser ID
function getDeviceID() {
    let deviceID = localStorage.getItem("sonic_device_id");

    if (!deviceID) {
        deviceID = crypto.randomUUID();

        localStorage.setItem(
            "sonic_device_id",
            deviceID
        );
    }

    return deviceID;
}

// Activate or verify passcode
async function loginWithPasscode(passcode) {
    const deviceID = getDeviceID();

    const { data, error } = await sonicDB.rpc(
        "activate_sonic_passcode",
        {
            p_code: passcode.trim(),
            p_device_id: deviceID
        }
    );

    if (error) {
        console.error(error);
        return {
            success: false,
            message: "Connection error. Please try again."
        };
    }

    if (
        data === "activated" ||
        data === "already_activated_same_device"
    ) {
        localStorage.setItem(
            "sonic_active_passcode",
            passcode.trim()
        );

        return {
            success: true,
            message: "Access granted!"
        };
    }

    if (data === "used_password") {
        return {
            success: false,
            message: "This passcode has already been used on another device."
        };
    }

    return {
        success: false,
        message: "Invalid passcode. Please check and try again."
    };
}

// Protect paid pages
async function enforcePaywall() {
    const passcode = localStorage.getItem(
        "sonic_active_passcode"
    );

    if (!passcode) {
        window.location.replace("index.html");
        return;
    }

    const result = await loginWithPasscode(passcode);

    if (!result.success) {
        localStorage.removeItem("sonic_active_passcode");
        alert(result.message);
        window.location.replace("index.html");
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem("sonic_active_passcode");
    window.location.replace("index.html");
}
