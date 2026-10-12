// WASTE WISE (resident) - Notifications page

function showNotifications() {
    var list = data.notifications;
    if (list.length === 0) {
        $("groupsBox").innerHTML = '<div class="card empty">You are all caught up.</div>';
        return;
    }

    // the group names in the order they appear (Today, Yesterday, ...)
    var groups = [];
    for (var i = 0; i < list.length; i++) {
        if (groups.indexOf(list[i].when) === -1) { groups.push(list[i].when); }
    }

    var html = "";
    for (var g = 0; g < groups.length; g++) {
        html += '<h3 class="group-label">' + groups[g] + '</h3><div class="card list-card">';
        for (var n = 0; n < list.length; n++) {
            if (list[n].when !== groups[g]) { continue; }
            html += '<div class="row-item' + (list[n].unread ? " unread" : "") + '">' +
                    "<div><b>" + list[n].title + "</b><p>" + list[n].text + "</p></div>" +
                    "<time>" + list[n].when + "</time></div>";
        }
        html += "</div>";
    }
    $("groupsBox").innerHTML = html;
}

$("readAllBtn").addEventListener("click", function () {
    for (var i = 0; i < data.notifications.length; i++) { data.notifications[i].unread = false; }
    saveData();
    updateBadges();
    showNotifications();
    showToast("All notifications marked as read");
});

showNotifications();