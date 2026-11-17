
// Hämta sparade favorit-ID:n
function getFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Kunde inte läsa favoriter:", error);
        return [];
    }
}


function updateFavoriteButtons() {
    const favorites = getFavorites();

    document.querySelectorAll(".add-to-favorites").forEach(button => {
        const id = Number(button.dataset.id);
        const isFavorite = favorites.includes(id);

        button.innerHTML = `
            <span class="material-symbols-outlined" aria-hidden="true">
                favorite
            </span>
            <span>${isFavorite ? "Ta bort favorit" : "Spara som favorit"}</span>
        `;

        button.setAttribute("aria-pressed", String(isFavorite));
    });
}


// Hantera klick på favoritknapparna
document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-favorites");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (!Number.isSafeInteger(id) || id <= 0) return;

    let favorites = getFavorites();
    const isFavorite = favorites.includes(id);

    if (isFavorite) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    try {
        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );
    } catch (error) {
        console.error("Kunde inte spara favorit:", error);
        alert("Kunde inte spara favoriten.");
        return;
    }

    updateFavoriteButtons();

    // Ta bort kortet om vi är på favoritsidan
    const favoritesList = document.querySelector("#favorites-list");

    if (favoritesList && isFavorite) {
        button.closest(".product-card").remove();

        if (favoritesList.children.length === 0) {
            document.querySelector("#favorites-status").textContent =
                "Du har inga favoriter ännu.";
        }
    }
});

async function showFavorites() {
    const favoritesList = document.querySelector("#favorites-list");
    const status = document.querySelector("#favorites-status");
    if (!favoritesList) return;
    const favoriteIds = getFavorites();
    if (favoriteIds.length === 0) {
        status.textContent = "Du har inga favoriter ännu.";
        return;
    }
    status.textContent = "Laddar favoriter...";
    try {
        const products = await getTechProducts();
        const favorites = products.filter(product =>
            favoriteIds.includes(product.id)
        );
        favoritesList.innerHTML = "";
        for (const product of favorites) {
            const card = document.createElement("article");
            card.className = "product-card";

            const image = document.createElement("img");
            image.src = product.thumbnail;
            image.alt = product.title;

            const title = document.createElement("h2");
            title.textContent = product.title;

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = product.price + " $";

            const link = document.createElement("a");
            link.href = `details.html?id=${product.id}`;
            link.textContent = "Visa mer";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "add-to-favorites";
            button.dataset.id = product.id;

            card.append(image, title, price, link, button);
            favoritesList.append(card);
        }

        updateFavoriteButtons();
        status.textContent = favorites.length > 0
            ? `${favorites.length} sparade produkter`
            : "Inga favoritprodukter hittades i sortimentet.";
    } catch (error) {
        status.textContent =
            "Kunde inte hämta favoriterna. Försök igen senare.";

        console.error(error);
    }
}

showFavorites();
