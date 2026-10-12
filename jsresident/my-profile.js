// WASTE WISE (resident) - edit and save the authenticated resident's profile.
var profileForm = $("profileEditor");
var editProfileButton = $("editBtn");

function populateProfileForm() {
	$("profileName").value = user.fullName || "";
	$("profileEmail").value = (user.email || "").indexOf("@") !== -1 ? user.email : "";
	$("profilePhone").value = user.phone || ((user.email || "").indexOf("@") === -1 ? user.email : "");
	$("profileBarangay").value = user.barangay || "";
	var addressDetails = user.addressDetails || "";
	if (!addressDetails && user.address) {
		addressDetails = user.address.split(",").map(function (part) { return part.trim(); })
			.filter(function (part) { return !/^(minglanilla|cebu(?:\s+6046)?|philippines)$/i.test(part); })[0] || "";
	}
	$("profileAddressDetails").value = addressDetails;
	$("profileFormStatus").textContent = "";
}

function openProfileEditor(focusEmail) {
	populateProfileForm();
	profileForm.classList.remove("hide");
	editProfileButton.setAttribute("aria-expanded", "true");
	if (focusEmail) { $("profileEmail").focus(); }
}

function closeProfileEditor() {
	profileForm.classList.add("hide");
	editProfileButton.setAttribute("aria-expanded", "false");
	profileForm.reset();
	["profileName", "profileEmail", "profilePhone", "profileBarangay"].forEach(function (id) {
		$(id).classList.remove("invalid");
	});
	document.querySelectorAll("#profileEditor .error-text").forEach(function (error) {
		error.classList.remove("show");
	});
	$("profileFormStatus").textContent = "";
}

editProfileButton.addEventListener("click", function () {
	if (profileForm.classList.contains("hide")) { openProfileEditor(false); }
	else { closeProfileEditor(); }
});

$("cancelEditBtn").addEventListener("click", closeProfileEditor);

profileForm.addEventListener("submit", function (event) {
	event.preventDefault();

	var name = $("profileName").value.trim();
	var email = $("profileEmail").value.trim();
	var phone = $("profilePhone").value.trim();
	var barangay = $("profileBarangay").value;
	var addressDetails = $("profileAddressDetails").value.trim();
	var address = (addressDetails ? addressDetails + ", " : "") + barangay + ", Minglanilla, Cebu 6046";
	var emailInvalid = email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	var phoneDigits = phone.replace(/\D/g, "").length;
	var phoneInvalid = (phone !== "" && (phoneDigits < 7 || phoneDigits > 15)) || (email === "" && phone === "");
	var nameInvalid = name.length < 2;
	var barangayInvalid = barangay === "";

	$("profileName").classList.toggle("invalid", nameInvalid);
	$("profileNameError").classList.toggle("show", nameInvalid);
	$("profileEmail").classList.toggle("invalid", emailInvalid);
	$("profileEmailError").classList.toggle("show", emailInvalid);
	$("profilePhone").classList.toggle("invalid", phoneInvalid);
	$("profilePhoneError").classList.toggle("show", phoneInvalid);
	$("profileBarangay").classList.toggle("invalid", barangayInvalid);
	$("profileBarangayError").classList.toggle("show", barangayInvalid);

	if (nameInvalid || emailInvalid || phoneInvalid || barangayInvalid) {
		$("profileFormStatus").textContent = "Please correct the highlighted information.";
		return;
	}

	var saved = saveUserProfile({
		fullName: name,
		email: email || phone,
		phone: phone,
		barangay: barangay,
		addressDetails: addressDetails,
		address: address
	});
	if (!saved.ok) {
		$("profileFormStatus").textContent = saved.error;
		return;
	}

	closeProfileEditor();
	showToast("Profile updated");
});

if (window.location.hash === "#edit" || window.location.hash === "#edit-email") {
	openProfileEditor(window.location.hash === "#edit-email");
}