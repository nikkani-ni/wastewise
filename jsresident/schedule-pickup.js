// WASTE WISE (resident) - Schedule pickup page

var wasteType = "Household waste";
var bags = 2;
var timeSlot = TIME_SLOTS[0];

// the date can only be tomorrow or later
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$("pickDate").min = toISODate(tomorrow);
$("pickDate").value = toISODate(tomorrow);

// the "Your request" box on the right
function updateSummary() {
    var date = $("pickDate").value;
    $("sumWaste").textContent = wasteType;
    $("sumAmount").textContent = bagsText(bags);
    $("sumDate").textContent = date ? weekday(date) + ", " + formatDate(date) : "Choose a date";
    $("sumTime").textContent = timeSlot;
}

// pick one button from a group (waste type or time slot)
function pickOne(groupId, buttonClass, callback) {
    var group = $(groupId);
    group.addEventListener("click", function (event) {
        var button = event.target.closest("." + buttonClass);
        if (!button) { return; }
        var all = group.querySelectorAll("." + buttonClass);
        for (var i = 0; i < all.length; i++) { all[i].classList.remove("selected"); }
        button.classList.add("selected");
        callback(button.getAttribute("data-value"));
        updateSummary();
    });
}

pickOne("wasteChoices", "choice", function (value) { wasteType = value; });
pickOne("timeChoices", "pill", function (value) { timeSlot = value; });

$("bagsMinus").addEventListener("click", function () {
    if (bags > 1) { bags--; }
    $("bagsCount").textContent = bags;
    updateSummary();
});

$("bagsPlus").addEventListener("click", function () {
    if (bags < 20) { bags++; }
    $("bagsCount").textContent = bags;
    updateSummary();
});

$("pickDate").addEventListener("input", updateSummary);

// ----- send the request -----
$("sendBtn").addEventListener("click", function () {
    var date = $("pickDate").value;
    var invalid = date === "" || date < $("pickDate").min;
    $("pickDate").classList.toggle("invalid", invalid);
    $("dateError").classList.toggle("show", invalid);
    if (invalid) { return; }

    // new request number = highest number so far + 1
    var highest = 0;
    for (var i = 0; i < data.requests.length; i++) {
        var number = parseInt(data.requests[i].id.split("-")[1], 10);
        if (number > highest) { highest = number; }
    }
    var id = "WWW-" + String(highest + 1).padStart(4, "0");

    data.requests.unshift({
        id: id,
        date: date,
        time: timeSlot,
        type: wasteType,
        bags: bags,
        stage: 0,
        note: $("notes").value.trim(),
        collector: "",
        cancelled: false
    });
    addNotification("Request submitted", "Request #" + id + " is waiting for verification.");
    setFlash("Request sent. Track it here.");
    window.location.href = "request-details.html?id=" + id;
});

updateSummary();