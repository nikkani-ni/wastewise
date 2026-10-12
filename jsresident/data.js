// WASTE WISE (resident) - login check + saved data
// - Reads the account saved by login.html / register.html
// - If nobody is logged in, sends the visitor back to the login page
// - Every resident has their own requests and notifications (saved in the browser)

var TIME_SLOTS = ["8:00 AM – 10:00 AM", "10:00 AM – 12:00 NN", "1:00 PM – 3:00 PM"];

function getLoggedInUser() {
    var saved = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
    if (!saved) { return null; }
    try { return JSON.parse(saved); } catch (error) { return null; }
}

var user = getLoggedInUser();
if (user === null) {
    document.documentElement.style.visibility = "hidden";
    window.location.replace("../html/login.html");
    user = { id: "guest", fullName: "Guest", email: "", phone: "" };
}

var STORAGE_KEY = "ww_resident_" + user.id;

// sample data, only for the demo account
var demoData = {
    requests: [
        { id: "WWW-0004", date: "2026-10-18", time: TIME_SLOTS[0], type: "Recyclables", bags: 3, stage: 0, note: "Bottles and cartons are sorted.", collector: "", cancelled: false },
        { id: "WWW-0003", date: "2026-10-14", time: TIME_SLOTS[0], type: "Household waste", bags: 4, stage: 2, note: "", collector: "Mang Rudy", cancelled: false },
        { id: "WWW-0002", date: "2026-10-08", time: TIME_SLOTS[0], type: "Household waste", bags: 2, stage: 4, note: "", collector: "Mang Rudy", cancelled: false },
        { id: "WWW-0001", date: "2026-10-04", time: TIME_SLOTS[1], type: "Garden waste", bags: 5, stage: 4, note: "", collector: "Mang Rudy", cancelled: false },
        { id: "WWW-0000", date: "2026-10-02", time: TIME_SLOTS[0], type: "Household waste", bags: 6, stage: 0, note: "", collector: "", cancelled: true }
    ],
    notifications: [
        { title: "Collector assigned", text: "Mang Rudy will collect request #WWW-0003.", when: "Today", unread: true },
        { title: "Request verified", text: "Request #WWW-0003 passed verification.", when: "Yesterday", unread: true },
        { title: "Pickup reminder", text: "Your waste will be collected on Oct 14, 8:00 AM.", when: "Yesterday", unread: false },
        { title: "New announcement", text: "The October collection schedule is out.", when: "Oct 10", unread: false }
    ],
    emailOn: true,
    pushOn: true
};

// a brand-new resident starts with no requests
var newUserData = {
    requests: [],
    notifications: [
        { title: "Welcome to Waste Wise", text: "You can now schedule pickups and track them here.", when: "Today", unread: true }
    ],
    emailOn: true,
    pushOn: true
};

function loadData() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch (error) { /* use the starting data below */ }
    }
    var start = user.demo ? demoData : newUserData;
    return JSON.parse(JSON.stringify(start));
}

var data = loadData();

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}