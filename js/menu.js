// WASTEWISE - shared by every landing page.
// 1) opens and closes the mobile menu
// 2) shows a warning if the CSS files were not found (wrong folder names)

document.addEventListener("DOMContentLoaded", function () {
    var menuToggle = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    }

    if (menuToggle && navLinks) {
        // click the hamburger button
        menuToggle.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("open"));
        });

        // click a link -> close the menu
        var links = navLinks.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function () { setMenu(false); });
        }

        // click outside the navbar -> close the menu
        document.addEventListener("click", function (event) {
            if (!event.target.closest(".navbar")) { setMenu(false); }
        });

        // press Escape -> close the menu
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") { setMenu(false); }
        });

        // going back to a wide screen -> close the menu
        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) { setMenu(false); }
        });
    }

    // base.css sets --css-loaded: 1. If we cannot read it, the CSS file was not found.
    var loaded = getComputedStyle(document.body).getPropertyValue("--css-loaded").trim();
    if (loaded !== "1") {
        var box = document.createElement("div");
        box.style.cssText = "background:#fff3cd;color:#664d03;padding:12px 16px;font:14px Arial,sans-serif;border-bottom:2px solid #e0a800";
        box.textContent = "The design files (css folder) were not found. Keep the html, css, js, html-resident, css-resident and jsresident folders together, then open the site with Live Server.";
        document.body.insertBefore(box, document.body.firstChild);
    }
});