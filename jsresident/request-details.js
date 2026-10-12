// WASTE WISE (resident) - Request details page
// Open it with a link like: request-details.html?id=WWW-0003

var id = new URLSearchParams(window.location.search).get("id");
var request = findRequest(id);

var messages = [
    "Waiting for staff to verify your request.",
    "Verified. A collector will be assigned soon.",
    "Collector assigned.",
    "Your collector is on the way. Bring your waste to the collection point.",
    "Collected. Thank you for keeping Purok 4 clean."
];

function showRequest() {
    $("detTitle").textContent = "Request #" + request.id;
    $("detBadge").textContent = statusLabel(request);
    $("detBadge").className = "badge " + statusOf(request);

    $("dDate").textContent = weekday(request.date) + ", " + formatDate(request.date);
    $("dTime").textContent = request.time;
    $("dType").textContent = request.type;
    $("dBags").textContent = bagsText(request.bags);
    $("rowNote").classList.toggle("hide", request.note === "");
    $("dNote").textContent = request.note;

    var timeline = $("timeline");
    var items = timeline.children;

    if (request.cancelled) {
        $("detMessage").textContent = "You cancelled this request.";
        timeline.classList.add("hide");
    } else {
        timeline.classList.remove("hide");
        var message = messages[request.stage];
        if (request.stage === 2 && request.collector) { message = "Collector assigned: " + request.collector + "."; }
        $("detMessage").textContent = message;

        for (var i = 0; i < items.length; i++) {
            var done = i < request.stage || request.stage === 4;
            var current = i === request.stage && request.stage < 4;
            items[i].className = done ? "done" : current ? "current" : "";
            items[i].querySelector(".dot").textContent = done ? "✓" : "";

            var sub = items[i].querySelector("small");
            if (i > request.stage) { sub.textContent = "Upcoming"; }
            else if (i === 2 && request.collector) { sub.textContent = "Assigned to " + request.collector; }
            else { sub.textContent = sub.getAttribute("data-text"); }
        }
    }

    // only a pending request can be cancelled
    $("cancelBtn").classList.toggle("hide", request.cancelled || request.stage !== 0);

    // the blue route on the map only shows while the collector is on the way
    $("route").style.display = (!request.cancelled && request.stage === 3) ? "inline" : "none";
    if (request.stage === 3 && !request.cancelled) { $("mapNote").textContent = "Your collector is on the way."; }
    else if (request.stage === 4 && !request.cancelled) { $("mapNote").textContent = "This pickup is complete."; }
    else { $("mapNote").textContent = "Live location shows once your collector is on the way."; }
}

if (request === null) {
    $("detailBox").classList.add("hide");
    $("notFound").classList.remove("hide");
} else {
    // remember the original sub-text of every step
    var steps = $("timeline").children;
    for (var s = 0; s < steps.length; s++) {
        var small = steps[s].querySelector("small");
        small.setAttribute("data-text", small.textContent);
    }

    $("cancelBtn").addEventListener("click", function () {
        request.cancelled = true;
        addNotification("Request cancelled", "Request #" + request.id + " was cancelled.");
        updateBadges();
        showRequest();
        showToast("Request cancelled");
    });

    showRequest();
}