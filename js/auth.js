/* WASTEWISE – shared account helpers for login.html and register.html.
   Accounts are kept in the browser (localStorage) so the capstone demo works without a server.
   Passwords are stored only as a salted SHA-256 hash, never as plain text.
   For real use, replace these functions with calls to your backend API. */
const WW = (function () {
    const USERS_KEY = "users";
    const SESSION_KEY = "loggedInUser";
    const RESIDENT_HOME = "../html-resident/dashboard.html";

    function readUsers() {
        try {
            const list = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
            return Array.isArray(list) ? list : [];
        } catch (error) {
            return [];
        }
    }

    function writeUsers(list) {
        localStorage.setItem(USERS_KEY, JSON.stringify(list));
    }

    /* emails compare in lowercase, phone numbers compare by digits only */
    function normalize(contact) {
        const value = String(contact || "").trim();
        return value.includes("@") ? value.toLowerCase() : value.replace(/\D/g, "");
    }

    function isValidContact(value) {
        const input = String(value || "").trim();
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return true;
        const digits = (input.match(/\d/g) || []).length;
        return /^\+?[\d\s()-]{7,20}$/.test(input) && digits >= 7 && digits <= 15;
    }

    function newSalt() {
        const bytes = new Uint8Array(8);
        if (window.crypto && crypto.getRandomValues) {
            crypto.getRandomValues(bytes);
        } else {
            for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
        }
        return Array.from(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }

    async function hash(password, salt) {
        const text = salt + ":" + password;
        if (window.crypto && crypto.subtle) {
            const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            return Array.from(new Uint8Array(digest), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
        }
        /* fallback for browsers without crypto.subtle (not secure, demo only) */
        let h = 5381;
        for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
        return "x" + h.toString(16);
    }

    function findUser(contact) {
        const wanted = normalize(contact);
        return readUsers().find(function (user) {
            return user && user.email && normalize(user.email) === wanted;
        }) || null;
    }

    /* what the resident pages are allowed to see (no hash, no salt) */
    function publicUser(user) {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || "",
            role: user.role || "Resident",
            demo: Boolean(user.demo)
        };
    }

    function setSession(user, remember) {
        const json = JSON.stringify(publicUser(user));
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
        (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, json);
    }

    function getSession() {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    async function register(details) {
        const existingUser = findUser(details.contact);
        if (existingUser && existingUser.passwordHash) {
            return { ok: false, field: "email", error: "This email address or phone number is already registered." };
        }

        const salt = newSalt();
        const isEmail = details.contact.includes("@");
        const user = {
            id: "resident-" + Date.now(),
            fullName: details.fullName,
            email: details.contact,
            phone: isEmail ? "" : details.contact,
            role: "Resident",
            salt: salt,
            passwordHash: await hash(details.password, salt),
            registeredAt: new Date().toISOString()
        };

        try {
            const users = readUsers().filter(function (savedUser) {
                return !savedUser || normalize(savedUser.email) !== normalize(details.contact);
            });
            users.push(user);
            writeUsers(users);
        } catch (error) {
            return { ok: false, error: "Unable to save your account. Please check your browser storage settings." };
        }

        setSession(user, true);
        return { ok: true, user: user };
    }

    async function login(contact, password, remember) {
        const user = findUser(contact);

        if (!user) {
            return { ok: false, field: "email", error: "No account found with that email or phone number." };
        }

        if (!user.passwordHash) {
            return { ok: false, field: "email", error: "This account needs to be registered again." };
        }

        if ((await hash(password, user.salt)) !== user.passwordHash) {
            return { ok: false, field: "password", error: "Incorrect password. Please try again." };
        }

        if (user.role && user.role !== "Resident") {
            return { ok: false, field: "email", error: "Only resident accounts are available in this version." };
        }

        setSession(user, remember);
        return { ok: true, user: user };
    }

    async function changePassword(userId, currentPassword, newPassword) {
        const users = readUsers();
        const user = users.find(function (account) { return account && account.id === userId; });
        if (!user || !user.passwordHash) {
            return { ok: false, field: "current", error: "Could not find password details for this account." };
        }
        if ((await hash(currentPassword, user.salt)) !== user.passwordHash) {
            return { ok: false, field: "current", error: "Your current password is incorrect." };
        }

        const salt = newSalt();
        user.salt = salt;
        user.passwordHash = await hash(newPassword, salt);
        try {
            writeUsers(users);
            return { ok: true };
        } catch (error) {
            return { ok: false, error: "Unable to save your new password. Check your browser storage settings." };
        }
    }

    /* demo account for presentations: demo@wastewise.com / demo1234 */
    async function ensureDemo() {
        if (findUser("demo@wastewise.com")) return;
        const salt = newSalt();
        const users = readUsers();
        users.push({
            id: "resident-demo",
            fullName: "Yer Sanara",
            email: "demo@wastewise.com",
            phone: "0967 677 6767",
            role: "Resident",
            demo: true,
            salt: salt,
            passwordHash: await hash("demo1234", salt),
            registeredAt: new Date().toISOString()
        });
        try { writeUsers(users); } catch (error) { /* storage blocked */ }
    }

    return {
        RESIDENT_HOME: RESIDENT_HOME,
        isValidContact: isValidContact,
        register: register,
        login: login,
        changePassword: changePassword,
        getSession: getSession,
        ensureDemo: ensureDemo
    };
})();