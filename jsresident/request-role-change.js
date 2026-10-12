// WASTE WISE (resident) - Request role change page

$("sendBtn").addEventListener("click", function () {
    var noRole = $("roleSelect").value === "";
    var noReason = $("reasonInput").value.trim() === "";

    $("roleSelect").classList.toggle("invalid", noRole);
    $("roleError").classList.toggle("show", noRole);
    $("reasonInput").classList.toggle("invalid", noReason);
    $("reasonError").classList.toggle("show", noReason);
    if (noRole || noReason) { return; }

    addNotification("Role change requested", "The administrator will review your request.");
    setFlash("Request sent to the administrator");
    window.location.href = "settings.html";
});