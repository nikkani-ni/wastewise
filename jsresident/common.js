// WASTE WISE (resident) - helpers used by every resident page

function $(id) { return document.getElementById(id); }

// "2026-10-14" -> "Oct 14, 2026"
function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// "2026-10-14" -> "Wednesday"
function weekday(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long" });
}

// today / tomorrow as "YYYY-MM-DD" (local time)
function toISODate(d) {
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}

function bagsText(n) { return n + (n === 1 ? " bag" : " bags"); }

// pending / active / completed / cancelled
function statusOf(r) {
    if (r.cancelled) { return "cancelled"; }
    if (r.stage === 0) { return "pending"; }
    if (r.stage === 4) { return "completed"; }
    return "active";
}

function statusLabel(r) {
    var s = statusOf(r);
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function badgeHtml(r) {
    return '<span class="badge ' + statusOf(r) + '">' + statusLabel(r) + "</span>";
}

function findRequest(id) {
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].id === id) { return data.requests[i]; }
    }
    return null;
}

function unreadCount() {
    var n = 0;
    for (var i = 0; i < data.notifications.length; i++) {
        if (data.notifications[i].unread) { n++; }
    }
    return n;
}

function addNotification(title, text) {
    data.notifications.unshift({ title: title, text: text, when: "Today", unread: true });
    saveData();
}

// the red number on the bell, the sidebar and the phone tab bar
function updateBadges() {
    var n = unreadCount();
    var counters = document.querySelectorAll(".count");
    for (var i = 0; i < counters.length; i++) {
        counters[i].textContent = n;
        counters[i].classList.toggle("hide", n === 0);
    }
}

function showToast(message) {
    var box = $("toast");
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(box.timer);
    box.timer = setTimeout(function () { box.classList.remove("show"); }, 2600);
}

// a message that appears on the NEXT page (used after a redirect)
function setFlash(message) { sessionStorage.setItem("ww_flash", message); }

function initials(name) {
    var words = name.split(" ").filter(function (w) { return w !== ""; });
    var text = "";
    for (var i = 0; i < words.length && i < 2; i++) { text += words[i].charAt(0).toUpperCase(); }
    return text || "R";
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUser");
    window.location.href = "../html/login.html";
}

function normalizeResidentContact(value) {
    var contact = String(value || "").trim();
    return contact.indexOf("@") !== -1 ? contact.toLowerCase() : contact.replace(/\D/g, "");
}

function saveUserProfile(changes) {
    var updated = Object.assign({}, user, changes);
    var contact = updated.email;
    var accounts;
    var accountIndex = -1;

    try {
        accounts = JSON.parse(localStorage.getItem("users") || "[]");
        if (!Array.isArray(accounts)) { accounts = []; }

        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i] && accounts[i].id !== user.id &&
                    normalizeResidentContact(accounts[i].email) === normalizeResidentContact(contact)) {
                return { ok: false, error: "That email address or phone number is already used by another account." };
            }
            if (accounts[i] && accounts[i].id === user.id) { accountIndex = i; }
        }
        if (accountIndex < 0) {
            return { ok: false, error: "Could not find your account. Please log out and sign in again." };
        }

        accounts[accountIndex] = Object.assign({}, accounts[accountIndex], updated);
        localStorage.setItem("users", JSON.stringify(accounts));

        var remembered = localStorage.getItem("loggedInUser") !== null;
        (remembered ? localStorage : sessionStorage).setItem("loggedInUser", JSON.stringify(updated));
        if (remembered) { sessionStorage.removeItem("loggedInUser"); }
        else { localStorage.removeItem("loggedInUser"); }
        user = updated;
    } catch (error) {
        return { ok: false, error: "Unable to save your profile. Check your browser storage settings and try again." };
    }

    var nodes = document.querySelectorAll("[data-name]");
    for (var n = 0; n < nodes.length; n++) { nodes[n].textContent = user.fullName; }
    nodes = document.querySelectorAll("[data-initials]");
    for (var a = 0; a < nodes.length; a++) { nodes[a].textContent = initials(user.fullName); }
    nodes = document.querySelectorAll("[data-email]");
    for (var e = 0; e < nodes.length; e++) { nodes[e].textContent = user.email.indexOf("@") !== -1 ? user.email : "Not provided"; }
    nodes = document.querySelectorAll("[data-phone]");
    for (var p = 0; p < nodes.length; p++) { nodes[p].textContent = user.phone || (user.email.indexOf("@") === -1 ? user.email : "Not provided"); }
    nodes = document.querySelectorAll("[data-address]");
    for (var d = 0; d < nodes.length; d++) { nodes[d].textContent = user.address || "Purok 4, Minglanilla, Cebu"; }

    return { ok: true };
}

// ----- run on every page -----
function fillPage() {
    var hasEmail = (user.email || "").indexOf("@") !== -1;
    var phone = user.phone || (!hasEmail && user.email) || "Not provided";
    var email = hasEmail ? user.email : "Not provided";
    var items, i;

    items = document.querySelectorAll("[data-name]");
    for (i = 0; i < items.length; i++) { items[i].textContent = user.fullName; }
    items = document.querySelectorAll("[data-initials]");
    for (i = 0; i < items.length; i++) { items[i].textContent = initials(user.fullName); }
    items = document.querySelectorAll("[data-email]");
    for (i = 0; i < items.length; i++) { items[i].textContent = email; }
    items = document.querySelectorAll("[data-phone]");
    for (i = 0; i < items.length; i++) { items[i].textContent = phone; }
    items = document.querySelectorAll("[data-address]");
    for (i = 0; i < items.length; i++) { items[i].textContent = user.address || "Purok 4, Minglanilla, Cebu"; }

    items = document.querySelectorAll("[data-logout]");
    for (i = 0; i < items.length; i++) { items[i].addEventListener("click", logout); }

    updateBadges();

    var flash = sessionStorage.getItem("ww_flash");
    if (flash) {
        sessionStorage.removeItem("ww_flash");
        showToast(flash);
    }

    // style.css sets --css-loaded: 1. If we cannot read it, the CSS file was not found.
    if (getComputedStyle(document.body).getPropertyValue("--css-loaded").trim() !== "1") {
        var box = document.createElement("div");
        box.style.cssText = "background:#fff3cd;color:#664d03;padding:12px 16px;font:14px Arial,sans-serif;border-bottom:2px solid #e0a800";
        box.textContent = "The design files (css-resident folder) were not found. Keep the html, css, js, html-resident, css-resident and jsresident folders together, then open the site with Live Server.";
        document.body.insertBefore(box, document.body.firstChild);
    }
}

fillPage();