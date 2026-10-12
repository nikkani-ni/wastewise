
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const agreeTermsInput = document.getElementById("agreeTerms");

    const formMessage = document.getElementById("formMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");

            const isExpanded = navLinks.classList.contains("open");
            menuToggle.setAttribute("aria-expanded", String(isExpanded));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            if (
                !menuToggle.contains(event.target) &&
                !navLinks.contains(event.target)
            ) {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function clearErrors() {
        const errorElements = [
            nameError,
            emailError,
            passwordError,
            confirmPasswordError,
            termsError
        ];

        errorElements.forEach(function (element) {
            if (element) {
                element.textContent = "";
            }
        });

        [
            fullNameInput,
            emailInput,
            passwordInput,
            confirmPasswordInput,
            agreeTermsInput
        ].forEach(function (element) {
            if (element) {
                element.removeAttribute("aria-invalid");
            }
        });

        if (formMessage) {
            formMessage.textContent = "";
            formMessage.classList.remove("success", "error");
        }
    }

    function showError(element, message, inputElement) {
        if (element) {
            element.textContent = message;
        }

        if (inputElement) {
            inputElement.setAttribute("aria-invalid", "true");
        }
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.classList.remove("success", "error");
        formMessage.classList.add(type);
    }

    document.querySelectorAll(".show-password").forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);

            if (!targetInput) return;

            const isPassword = targetInput.type === "password";

            targetInput.type = isPassword ? "text" : "password";

            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                String(isPassword)
            );

            const eyeIcon = button.querySelector(".eye-icon");

            if (eyeIcon) {
                eyeIcon.textContent = isPassword ? "🙈" : "👁";
            }
        });
    });

    function validateFullName() {
        const fullName = fullNameInput
            ? fullNameInput.value.trim()
            : "";

        if (!fullName) {
            showError(nameError, "Please enter your full name.", fullNameInput);
            return false;
        }

        if (fullName.length < 2) {
            showError(nameError, "Name must contain at least 2 characters.", fullNameInput);
            return false;
        }

        return true;
    }

    function validateEmailOrPhone() {
        const contact = emailInput
            ? emailInput.value.trim()
            : "";

        if (!contact) {
            showError(
                emailError,
                "Please enter your email address or phone number.",
                emailInput
            );
            return false;
        }


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        const phonePattern = /^\+?[\d\s()-]{7,20}$/;
        const digitCount = contact.replace(/\D/g, "").length;

        const isValidEmail = emailPattern.test(contact);
        const isValidPhone =
            phonePattern.test(contact) &&
            digitCount >= 7 &&
            digitCount <= 15;

        if (!isValidEmail && !isValidPhone) {
            showError(
                emailError,
                "Please enter a valid email address or phone number.",
                emailInput
            );
            return false;
        }

        return true;
    }

    function validatePassword() {
        const password = passwordInput
            ? passwordInput.value
            : "";

        if (!password) {
            showError(passwordError, "Please create a password.", passwordInput);
            return false;
        }

        if (password.length < 8) {
            showError(
                passwordError,
                "Password must be at least 8 characters long.",
                passwordInput
            );
            return false;
        }

        if (!/[A-Za-z]/.test(password)) {
            showError(
                passwordError,
                "Password must contain at least one letter.",
                passwordInput
            );
            return false;
        }

        if (!/\d/.test(password)) {
            showError(
                passwordError,
                "Password must contain at least one number.",
                passwordInput
            );
            return false;
        }

        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput
            ? passwordInput.value
            : "";

        const confirmPassword = confirmPasswordInput
            ? confirmPasswordInput.value
            : "";

        if (!confirmPassword) {
            showError(
                confirmPasswordError,
                "Please confirm your password.",
                confirmPasswordInput
            );
            return false;
        }

        if (password !== confirmPassword) {
            showError(
                confirmPasswordError,
                "Passwords do not match.",
                confirmPasswordInput
            );
            return false;
        }

        return true;
    }

    function validateTerms() {
        if (!agreeTermsInput || !agreeTermsInput.checked) {
            showError(
                termsError,
                "Please agree to the Terms and Conditions.",
                agreeTermsInput
            );
            return false;
        }

        return true;
    }

    if (fullNameInput) {
        fullNameInput.addEventListener("input", function () {
            if (nameError) nameError.textContent = "";
            fullNameInput.removeAttribute("aria-invalid");
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            if (emailError) emailError.textContent = "";
            emailInput.removeAttribute("aria-invalid");
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            if (passwordError) passwordError.textContent = "";
            if (confirmPasswordError) {
                confirmPasswordError.textContent = "";
            }

            passwordInput.removeAttribute("aria-invalid");

            if (confirmPasswordInput) {
                confirmPasswordInput.removeAttribute("aria-invalid");
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener("input", function () {
            if (confirmPasswordError) {
                confirmPasswordError.textContent = "";
            }

            confirmPasswordInput.removeAttribute("aria-invalid");
        });
    }

    if (agreeTermsInput) {
        agreeTermsInput.addEventListener("change", function () {
            if (termsError) termsError.textContent = "";
            agreeTermsInput.removeAttribute("aria-invalid");
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearErrors();


            const isNameValid = validateFullName();
            const isContactValid = validateEmailOrPhone();
            const isPasswordValid = validatePassword();
            const isConfirmPasswordValid = validateConfirmPassword();
            const areTermsAccepted = validateTerms();

            const isFormValid =
                isNameValid &&
                isContactValid &&
                isPasswordValid &&
                isConfirmPasswordValid &&
                areTermsAccepted;

            if (!isFormValid) {
                showFormMessage(
                    "Please check the highlighted fields and try again.",
                    "error"
                );
                return;
            }

            if (typeof WW === "undefined") {
                showFormMessage("Registration is unavailable. Reload the page and try again.", "error");
                return;
            }

            const submitButton = registerForm.querySelector('[type="submit"]');
            submitButton.disabled = true;
            showFormMessage("Creating your account…", "success");

            WW.register({
                fullName: fullNameInput.value.trim(),
                contact: emailInput.value.trim(),
                password: passwordInput.value
            }).then(function (result) {
                if (!result.ok) {
                    if (result.field === "email") {
                        showError(emailError, result.error, emailInput);
                    }
                    showFormMessage(result.error || "Unable to create your account.", "error");
                    return;
                }
                window.location.href = WW.RESIDENT_HOME;
            }).catch(function () {
                showFormMessage("Unable to save your account. Check your browser storage settings and try again.", "error");
            }).finally(function () {
                submitButton.disabled = false;
            });
        });
    }

    function openDialog(dialogId) {
        const dialog = document.getElementById(dialogId);

        if (!dialog) return;

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
    }

    function closeDialog(dialog) {
        if (!dialog) return;

        if (typeof dialog.close === "function") {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    const termsLink = document.getElementById("termsLink");
    const privacyLink = document.getElementById("privacyLink");

    const termsDialog = document.getElementById("termsDialog");
    const privacyDialog = document.getElementById("privacyDialog");

    if (termsLink) {
        termsLink.addEventListener("click", function (event) {
            event.preventDefault();
            openDialog("termsDialog");
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener("click", function (event) {
            event.preventDefault();
            openDialog("privacyDialog");
        });
    }

    document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
        button.addEventListener("click", function () {
            const dialog = button.closest("dialog");

            closeDialog(dialog);
        });
    });

    [termsDialog, privacyDialog].forEach(function (dialog) {
        if (!dialog) return;

        dialog.addEventListener("click", function (event) {
            if (event.target === dialog) {
                closeDialog(dialog);
            }
        });
    });
});
