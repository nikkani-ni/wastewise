// WASTE WISE (resident) - Dashboard page

var hour = new Date().getHours();
var greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";
$("greeting").textContent = greeting;
$("firstName").textContent = user.fullName.split(" ")[0];

// ----- the next pickup = the earliest request that is not finished or cancelled -----
var next = null;
for (var i = 0; i < data.requests.length; i++) {
    var r = data.requests[i];
    if (!r.cancelled && r.stage < 4) {
        if (next === null || r.date < next.date) { next = r; }
    }
}

if (next === null) {
    $("heroLabel").textContent = "";
    $("heroDate").textContent = "No pickups yet";
    $("heroInfo").textContent = "Need your waste collected? It only takes a minute.";
    $("heroBtn").textContent = "Schedule a pickup";
    $("heroBtn").href = "schedule-pickup.html";
    $("heroSteps").classList.add("hide");
} else {
    var shortDate = formatDate(next.date).replace(/, \d{4}$/, "");
    $("heroDate").textContent = weekday(next.date) + ", " + shortDate;
    $("heroInfo").textContent = next.time + " · " + bagsText(next.bags) + " of " + next.type.toLowerCase();
    $("heroBtn").href = "request-details.html?id=" + next.id;

    var steps = $("heroSteps").children;
    for (var s = 0; s < steps.length; s++) {
        if (s < next.stage) { steps[s].className = "done"; }
        else if (s === next.stage) { steps[s].className = "current"; }
    }
}

// ----- numbers -----
var openCount = 0;
var completed = 0;
for (var k = 0; k < data.requests.length; k++) {
    var status = statusOf(data.requests[k]);
    if (status === "pending" || status === "active") { openCount++; }
    if (status === "completed") { completed++; }
}
$("statTotal").textContent = data.requests.length;
$("statOpen").textContent = openCount;
$("statDone").textContent = completed;

// ----- the 3 newest notifications -----
var html = "";
for (var n = 0; n < data.notifications.length && n < 3; n++) {
    var note = data.notifications[n];
    html += '<div class="row-item' + (note.unread ? " unread" : "") + '">' +
            "<div><b>" + note.title + "</b><p>" + note.text + "</p></div>" +
            "<time>" + note.when + "</time></div>";
}
$("updatesList").innerHTML = html || '<p class="empty">No updates yet.</p>';