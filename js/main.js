
// Find the button and the menu
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

// Open or close the menu when you click the button
menuButton.addEventListener("click", function () {
    siteNav.classList.toggle("open");

    const isOpen = siteNav.classList.contains("open");
    menuButton.setAttribute("aria-expanded", isOpen);
});

// Close the menu when you press Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
    siteNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", false);
  }
});

