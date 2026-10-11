
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = navLinks
        ? navLinks.querySelectorAll("a")
        : [];

    function openMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-open");
    }

    function toggleMenu() {
        if (!navLinks) return;

        const isOpen = navLinks.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", toggleMenu);

        navItems.forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            const clickedInsideNavbar =
                event.target.closest(".navbar");

            if (
                !clickedInsideNavbar &&
                navLinks.classList.contains("open")
            ) {
                closeMenu();
            }
        });


        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                navLinks.classList.contains("open")
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });
    }

});
