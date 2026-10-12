// WASTE WISE (resident) - saved notification preferences and account security.
$("emailSwitch").checked = Boolean(data.emailOn);
$("pushSwitch").checked = Boolean(data.pushOn);

function savePreference(key, checkbox) {
    var previous = data[key];
    data[key] = checkbox.checked;
    try {
        saveData();
        showToast("Notification preference saved");
    } catch (error) {
        data[key] = previous;
        checkbox.checked = Boolean(previous);
        showToast("Unable to save the preference. Check browser storage settings.");
    }
}

$("emailSwitch").addEventListener("change", function () {
    savePreference("emailOn", $("emailSwitch"));
});

$("pushSwitch").addEventListener("change", function () {
    savePreference("pushOn", $("pushSwitch"));
});

var passwordDialog = $("passwordDialog");
var passwordForm = $("passwordForm");

function resetPasswordForm() {
    passwordForm.reset();
    ["currentPassword", "newPassword", "confirmNewPassword"].forEach(function (id) {
        $(id).classList.remove("invalid");
    });
    document.querySelectorAll("#passwordForm .error-text").forEach(function (error) {
        error.classList.remove("show");
    });
    $("passwordFormStatus").textContent = "";
}

$("changePasswordBtn").addEventListener("click", function () {
    resetPasswordForm();
    if (typeof passwordDialog.showModal === "function") { passwordDialog.showModal(); }
    else { passwordDialog.setAttribute("open", ""); }
    $("currentPassword").focus();
});

$("cancelPasswordBtn").addEventListener("click", function () {
    if (typeof passwordDialog.close === "function") { passwordDialog.close(); }
    else { passwordDialog.removeAttribute("open"); }
    resetPasswordForm();
});

passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var current = $("currentPassword").value;
    var next = $("newPassword").value;
    var confirmation = $("confirmNewPassword").value;
    var currentMissing = current.length === 0;
    var passwordInvalid = next.length < 8 || !/[A-Za-z]/.test(next) || !/\d/.test(next);
    var confirmInvalid = confirmation !== next || confirmation.length === 0;

    $("currentPassword").classList.toggle("invalid", currentMissing);
    $("currentPasswordError").classList.toggle("show", currentMissing);
    $("newPassword").classList.toggle("invalid", passwordInvalid);
    $("newPasswordError").classList.toggle("show", passwordInvalid);
    $("confirmNewPassword").classList.toggle("invalid", confirmInvalid);
    $("confirmNewPasswordError").classList.toggle("show", confirmInvalid);
    if (currentMissing || passwordInvalid || confirmInvalid) {
        $("passwordFormStatus").textContent = "Please correct the highlighted fields.";
        return;
    }

    var submit = passwordForm.querySelector('[type="submit"]');
    submit.disabled = true;
    WW.changePassword(user.id, current, next).then(function (result) {
        if (!result.ok) {
            if (result.field === "current") {
                $("currentPassword").classList.add("invalid");
                $("currentPasswordError").classList.add("show");
                $("currentPasswordError").textContent = result.error;
            }
            $("passwordFormStatus").textContent = result.error || "Unable to change your password.";
            return;
        }
        if (typeof passwordDialog.close === "function") { passwordDialog.close(); }
        else { passwordDialog.removeAttribute("open"); }
        resetPasswordForm();
        showToast("Password changed successfully");
    }).catch(function () {
        $("passwordFormStatus").textContent = "Unable to change your password. Check browser storage settings and try again.";
    }).finally(function () {
        submit.disabled = false;
    });
});