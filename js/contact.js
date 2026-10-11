
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    function openMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("menu-open");
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            const isOpen =
                navLinks.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (
                !event.target.closest(".navbar") &&
                navLinks.classList.contains("open")
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                navLinks.classList.contains("open")
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }


    const contactForm = document.getElementById("contactForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const characterCount = document.getElementById("characterCount");
    const formStatus = document.getElementById("formStatus");

    const MAX_CHARACTERS = 1000;

    if (!contactForm) return;


    function updateCharacterCount() {
        if (!message || !characterCount) return;

        // Limit the message to 1,000 characters
        if (message.value.length > MAX_CHARACTERS) {
            message.value = message.value.slice(0, MAX_CHARACTERS);
        }

        characterCount.textContent = message.value.length;
    }

    if (message) {
        message.setAttribute("maxlength", MAX_CHARACTERS);

        message.addEventListener("input", function () {
            updateCharacterCount();

            if (formStatus) {
                formStatus.textContent = "";
                formStatus.classList.remove("error-status");
            }
        });

        updateCharacterCount();
    }

    function showStatus(text, isError) {
        if (!formStatus) return;

        formStatus.textContent = text;
        formStatus.classList.toggle(
            "error-status",
            Boolean(isError)
        );
    }

    function clearStatus() {
        if (!formStatus) return;

        formStatus.textContent = "";
        formStatus.classList.remove("error-status");
    }

    [fullName, email, subject, message].forEach(function (field) {
        if (!field) return;

        field.addEventListener("input", clearStatus);
        field.addEventListener("change", clearStatus);
    });


    function validateForm() {

        if (
            !fullName ||
            !email ||
            !subject ||
            !message
        ) {
            showStatus(
                "Unable to process the form. Please check the form fields.",
                true
            );
            return false;
        }

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const messageValue = message.value.trim();

        if (nameValue.length < 2) {
            showStatus(
                "Please enter your full name with at least 2 characters.",
                true
            );
            fullName.focus();
            return false;
        }

        if (!/[A-Za-zÀ-ÿ]/.test(nameValue)) {
            showStatus(
                "Please enter a valid name.",
                true
            );
            fullName.focus();
            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            showStatus(
                "Please enter a valid email address.",
                true
            );
            email.focus();
            return false;
        }

        if (!subject.value) {
            showStatus(
                "Please select a subject for your message.",
                true
            );
            subject.focus();
            return false;
        }

        if (messageValue.length < 10) {
            showStatus(
                "Your message must contain at least 10 characters.",
                true
            );
            message.focus();
            return false;
        }

        if (message.value.length > MAX_CHARACTERS) {
            showStatus(
                "Your message cannot exceed 1,000 characters.",
                true
            );
            message.focus();
            return false;
        }

        return true;
    }


    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearStatus();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (!validateForm()) {
            return;
        }

        const contactData = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            subject: subject.value,
            message: message.value.trim()
        };


        console.log("WASTEWISE Contact Form Data:", contactData);

        showStatus(
            "Your form has been validated successfully! " +
            "Actual message delivery is not yet available. " +
            "Please contact the WASTEWISE team directly for now.",
            false
        );

    });

});
