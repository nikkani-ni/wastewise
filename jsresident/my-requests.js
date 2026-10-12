// WASTE WISE (resident) - My requests page

var filter = "all";

function countFor(name) {
    if (name === "all") { return data.requests.length; }
    var n = 0;
    for (var i = 0; i < data.requests.length; i++) {
        if (statusOf(data.requests[i]) === name) { n++; }
    }
    return n;
}

function showRequests() {
    // update the filter buttons
    var chips = document.querySelectorAll(".chip");
    for (var c = 0; c < chips.length; c++) {
        var name = chips[c].getAttribute("data-filter");
        var label = name.charAt(0).toUpperCase() + name.slice(1);
        chips[c].textContent = label + " (" + countFor(name) + ")";
        chips[c].classList.toggle("selected", name === filter);
    }

    // build the table rows
    var rows = "";
    for (var i = 0; i < data.requests.length; i++) {
        var r = data.requests[i];
        if (filter !== "all" && statusOf(r) !== filter) { continue; }
        rows += "<tr>" +
            '<td class="req-id">#' + r.id + "</td>" +
            "<td>" + formatDate(r.date) + "<small>" + r.time + "</small></td>" +
            '<td class="col-waste">' + r.type + "<small>" + bagsText(r.bags) + "</small></td>" +
            "<td>" + badgeHtml(r) + "</td>" +
            '<td><a class="btn btn-light btn-small" href="request-details.html?id=' + r.id + '">View details</a></td>' +
            "</tr>";
    }

    if (rows === "") {
        $("tableCard").classList.add("hide");
        $("emptyCard").classList.remove("hide");
        $("emptyText").textContent = "No " + (filter === "all" ? "" : filter + " ") + "requests yet.";
    } else {
        $("tableCard").classList.remove("hide");
        $("emptyCard").classList.add("hide");
        $("tableBody").innerHTML = rows;
    }
}

$("chips").addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (!chip) { return; }
    filter = chip.getAttribute("data-filter");
    showRequests();
});

showRequests();