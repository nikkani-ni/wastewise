// WASTE WISE (resident) - Report improper disposal page (anonymous, photo is optional)

var reportType = "";

// default date and time = now
var now = new Date();
$("whenInput").value = toISODate(now) + "T" + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

// choose what was seen
$("typeChoices").addEventListener("click", function (event) {
    var button = event.target.closest(".choice");
    if (!button) { return; }
    var all = $("typeChoices").querySelectorAll(".choice");
    for (var i = 0; i < all.length; i++) { all[i].classList.remove("selected"); }
    button.classList.add("selected");
    reportType = button.getAttribute("data-value");
    $("typeChoices").classList.remove("invalid");
    $("typeError").classList.remove("show");
});

// show a preview of the chosen photo (max 5 MB)
$("photoInput").addEventListener("change", function () {
    var file = $("photoInput").files[0];
    if (!file) { return; }

    if (file.size > 5 * 1024 * 1024) {
        $("photoError").classList.add("show");
        $("photoInput").value = "";
        return;
    }
    $("photoError").classList.remove("show");

    var reader = new FileReader();
    reader.onload = function () {
        $("uploadBox").innerHTML = '<img src="' + reader.result + '" alt="Photo preview"><span class="hint">Click to change the photo</span>';
    };
    reader.readAsDataURL(file);
});

$("sendBtn").addEventListener("click", function () {
    var noType = reportType === "";
    var noPlace = $("placeInput").value.trim() === "";

    $("typeChoices").classList.toggle("invalid", noType);
    $("typeError").classList.toggle("show", noType);
    $("placeInput").classList.toggle("invalid", noPlace);
    $("placeError").classList.toggle("show", noPlace);
    if (noType || noPlace) { return; }

    addNotification("Report received", "Thank you. The barangay office will review your report.");
    setFlash("Report sent anonymously");
    window.location.href = "dashboard.html";
});