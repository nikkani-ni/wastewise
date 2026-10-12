document.addEventListener("DOMContentLoaded", function () {
    const authForm = document.getElementById("autoForm");

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const submitButton = document.getElementById("submitButton");
    const switchText = document.getElementById("switchText");

    const nameGroup = document.getElementById("nameGroup");
    const fullName = document.getElementById("fullName");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const loginOptions = document.getElementById("loginOptions");
    const togglePassword = document.getElementById("togglePassword");
    const eyeIcon = document.getElementById("eyeIcon");

    const forgotPassword = document.getElementById("forgotPassword");
    const formMessage = document.getElementById("formMessage");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");


    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    let currentMode =
        currentPage === "register.html" ? "register" : "login";

    const eyeOpen = `
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
    `;

    const eyeClosed = `
        <path d="M3 3l18 18"/>
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
        <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5
                 c6.5 0 10 7 10 7a16 16 0 0 1-4 4.8"/>
        <path d="M6.2 6.2C3.5 8 2 12 2 12
                 s3.5 7 10 7c1.1 0 2.1-.2 3-.5"/>
    `;

    function clearErrors() {
        document.querySelectorAll(".error").forEach(function (error) {
            error.textContent = "";
        });
    }

    function showError(id, message) {
        const errorElement = document.getElementById(id);

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function resetMessages() {
        clearErrors();

        if (formMessage) {
            formMessage.textContent = "";
            formMessage.style.color = "";
        }
    }


    if (togglePassword && password && eyeIcon) {
        togglePassword.addEventListener("click", function () {

            const shouldShow = password.type === "password";

            password.type = shouldShow ? "text" : "password";

            eyeIcon.innerHTML = shouldShow ? eyeClosed : eyeOpen;

            togglePassword.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                String(shouldShow)
            );
        });
    }


    function setMode(mode) {

        currentMode = mode;

        const isRegister = mode === "register";

        resetMessages();

        if (nameGroup) {
            nameGroup.hidden = !isRegister;
        }

        if (fullName) {
            fullName.required = isRegister;
            fullName.autocomplete = "name";
        }

        if (loginOptions) {
            loginOptions.hidden = isRegister;
        }

        if (formTitle) {
            formTitle.textContent = isRegister
                ? "Create an Account"
                : "Welcome Back!";
        }

        if (formSubtitle) {
            formSubtitle.textContent = isRegister
                ? "REGISTER TO START USING WASTEWISE"
                : "LOG IN TO YOUR ACCOUNT TO CONTINUE.";
        }

        if (submitButton) {
            submitButton.textContent = isRegister
                ? "Create Account"
                : "Login";
        }

        if (switchText) {
            switchText.innerHTML = isRegister
                ? 'Already have an account? <a href="login.html" class="register-link">Login here</a>'
                : 'Don\'t have an account? <a href="register.html" class="register-link">Register here</a>';
        }

        if (password) {
            password.autocomplete = isRegister
                ? "new-password"
                : "current-password";

            password.type = "password";
        }

        if (eyeIcon) {
            eyeIcon.innerHTML = eyeOpen;
        }

        if (togglePassword) {
            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                "false"
            );
        }
    }

    // Initialize the current page.
    setMode(currentMode);


    function isValidContact(value) {

        const input = value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phonePattern =
            /^\+?[\d\s()-]{7,20}$/;

        if (emailPattern.test(input)) {
            return true;
        }

        const digitCount = (input.match(/\d/g) || []).length;

        return phonePattern.test(input) &&
               digitCount >= 7 &&
               digitCount <= 15;
    }


    if (authForm) {

        authForm.addEventListener("submit", function (event) {

            event.preventDefault();

            resetMessages();

            let hasError = false;

            const contactValue = email ? email.value.trim() : "";
            const passwordValue = password ? password.value : "";

            if (
                currentMode === "register" &&
                fullName &&
                fullName.value.trim().length < 2
            ) {
                showError(
                    "nameError",
                    "Please enter your full name."
                );

                hasError = true;
            }

            if (!isValidContact(contactValue)) {

                showError(
                    "emailError",
                    "Enter a valid email address or phone number."
                );

                hasError = true;
            }

            if (passwordValue.length < 6) {

                showError(
                    "passwordError",
                    "Password must contain at least 6 characters."
                );

                hasError = true;
            }

            if (hasError) {
                return;
            }

            if (currentMode === "login") {
                if (typeof WW === "undefined") {
                    formMessage.textContent = "Login is unavailable. Reload the page and try again.";
                    return;
                }

                const remember = document.getElementById("remember");
                const submit = document.getElementById("submitButton");
                submit.disabled = true;
                formMessage.textContent = "Checking your account…";

                WW.login(contactValue, passwordValue, Boolean(remember && remember.checked))
                    .then(function (result) {
                        if (!result.ok) {
                            showError(result.field === "password" ? "passwordError" : "emailError", result.error);
                            formMessage.textContent = result.error;
                            return;
                        }
                        window.location.href = WW.RESIDENT_HOME;
                    })
                    .catch(function () {
                        formMessage.textContent = "Unable to log in. Check your browser storage settings and try again.";
                    })
                    .finally(function () {
                        submit.disabled = false;
                    });
            }
        });
    }


    if (forgotPassword) {

        forgotPassword.addEventListener("click", function (event) {

            event.preventDefault();

            if (formMessage) {
                formMessage.textContent =
                    "Please contact your WASTEWISE administrator to reset your password.";

                formMessage.style.color = "#526B43";
            }
        });
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            });
        });

        window.addEventListener("resize", function () {

            if (window.innerWidth > 760) {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            }
        });
    }

});