const slider = document.querySelector(".hero-slider");
const featuredStatus = document.querySelector("#featured-status");
const sliderContent = document.querySelector("#slider-content");
const sliderControls = document.querySelector("#slider-controls");
const sliderCounter = document.querySelector("#slider-counter");
const sliderDots = document.querySelector("#slider-dots");

const slideCategory = document.querySelector("#slide-category");
const slideTitle = document.querySelector("#slide-title");
const slideDescription = document.querySelector("#slide-description");
const slidePrice = document.querySelector("#slide-price");
const slideImage = document.querySelector("#slide-image");
const slideLink = document.querySelector("#slide-link");
const slideAnnouncement = document.querySelector("#slide-announcement");

const previousButton = document.querySelector("#slider-prev");
const nextButton = document.querySelector("#slider-next");
const playPauseButton = document.querySelector("#slider-play-pause");

const categories = ["smartphones", "laptops", "tablets", "mobile-accessories"];

const categoryNames = {
  smartphones: "Mobiler",
  laptops: "Datorer",
  tablets: "Surfplattor",
  "mobile-accessories": "Tillbehör",
};

const SLIDE_DELAY = 4500;

let featuredProducts = [];
let currentSlide = 0;
let intervalId = null;

let isPaused =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let pointerInside = false;
let focusInside = false;

function showSlide(index, announce = false) {
  currentSlide = (index + featuredProducts.length) % featuredProducts.length;

  const product = featuredProducts[currentSlide];

  slideCategory.textContent =
    categoryNames[product.category] || product.category;

  slideTitle.textContent = product.title;

  slideDescription.textContent =
    product.description || "Upptäck den här produkten hos Nova-store.";

  slidePrice.textContent = `${Number(product.price).toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} $`;

  slideImage.src = product.thumbnail;
  slideImage.alt = `Bild på ${product.title}`;

  slideLink.href = `details.html?id=${encodeURIComponent(product.id)}`;

  slideLink.setAttribute("aria-label", `Visa mer om ${product.title}`);

  sliderCounter.textContent =
    `${String(currentSlide + 1).padStart(2, "0")} / ` +
    `${String(featuredProducts.length).padStart(2, "0")}`;

  const dots = sliderDots.querySelectorAll("button");
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === currentSlide) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
  if (announce) {
    slideAnnouncement.textContent = `Produkt ${currentSlide + 1} av ${featuredProducts.length}: ${product.title}`;
  }
}

function stopAutoSlide() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function updateAutoSlide() {
  stopAutoSlide();

  if (
    !isPaused &&
    !pointerInside &&
    !focusInside &&
    !document.hidden &&
    featuredProducts.length > 1
  ) {
    intervalId = setInterval(() => {
      showSlide(currentSlide + 1);
    }, SLIDE_DELAY);
  }
}

function goToSlide(index) {
  showSlide(index, true);
  updateAutoSlide();
}

function updatePlayPauseButton() {
  playPauseButton.textContent = isPaused ? "Spela" : "Pausa";

  playPauseButton.setAttribute(
    "aria-label",
    isPaused ? "Starta automatisk bildväxling" : "Pausa automatisk bildväxling",
  );
}

function createDots() {
  sliderDots.innerHTML = "";
  featuredProducts.forEach((product, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slider-dot";

    button.setAttribute(
      "aria-label",
      `Visa produkt ${index + 1}: ${product.title}`,
    );

    button.addEventListener("click", () => {
      goToSlide(index);
    });

    sliderDots.append(button);
  });
}

previousButton.addEventListener("click", () => {
  goToSlide(currentSlide - 1);
});

nextButton.addEventListener("click", () => {
  goToSlide(currentSlide + 1);
});

playPauseButton.addEventListener("click", () => {
  isPaused = !isPaused;

  updatePlayPauseButton();
  updateAutoSlide();
});

slider.addEventListener("mouseenter", () => {
  pointerInside = true;
  updateAutoSlide();
});

slider.addEventListener("mouseleave", () => {
  pointerInside = false;
  updateAutoSlide();
});

slider.addEventListener("focusin", () => {
  focusInside = true;
  updateAutoSlide();
});

slider.addEventListener("focusout", (event) => {
  if (!slider.contains(event.relatedTarget)) {
    focusInside = false;
    updateAutoSlide();
  }
});

slider.addEventListener("keydown", (event) => {
  if (featuredProducts.length === 0) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    goToSlide(currentSlide + 1);
  }
});

document.addEventListener("visibilitychange", updateAutoSlide);

async function loadFeaturedProducts() {
  featuredStatus.textContent = "Laddar utvalda produkter";

  sliderContent.hidden = true;
  sliderControls.hidden = true;

  try {
    const products = await getTechProducts();
    featuredProducts = categories
      .map((category) =>
        products.find((product) => product.category === category),
      )
      .filter(Boolean);
    if (featuredProducts.length === 0) {
      featuredStatus.textContent = "Det finns inga utvalda produkter just nu.";
      return;
    }
    createDots();
    showSlide(0);
    updatePlayPauseButton();

    sliderContent.hidden = false;
    sliderControls.hidden = featuredProducts.length < 2;

    featuredStatus.textContent = "";

    updateAutoSlide();
  } catch (error) {
    featuredStatus.textContent =
      "Kunde inte hämta produkterna. Försök igen senare.";

    console.error("Fel när utvalda produkter hämtades:", error);
  }
}
loadFeaturedProducts();
