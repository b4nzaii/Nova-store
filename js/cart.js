
const cartItems = document.querySelector("#cart-items");
const emptyCart = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const summaryCount = document.querySelector("#summary-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const cartMessage = document.querySelector("#cart-message");

// Hämta varukorgen från localStorage
let cart = [];

try {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    // Slå ihop samma produkter
    for (const product of saved) {
        const existing = cart.find(item => item.id === product.id);
        const quantity = product.quantity || 1;

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
    }
} catch (error) {
    console.error("Kunde inte läsa varukorgen:", error);
    cartMessage.textContent = "Kunde inte läsa varukorgen.";
}

// Formatera priset
function formatPrice(price) {
    return Number(price).toFixed(2) + " $";
}

// Spara varukorgen
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        showCart();
        return true;
    } catch (error) {
        cartMessage.textContent = "Kunde inte spara varukorgen.";
        return false;
    }
}

// Visa varukorgen
function showCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    for (const product of cart) {
        total += product.price * product.quantity;
        totalQuantity += product.quantity;

        const item = document.createElement("li");
        item.className = "cart-item";

        item.innerHTML = `
            <a class="cart-image">
                <img alt="">
            </a>

            <div class="cart-item-details">
                <a class="cart-item-title"></a>
                <p class="cart-unit-price"></p>
                <button class="cart-remove">Ta bort</button>
            </div>

            <div class="cart-quantity">
                <button class="minus">−</button>
                <span class="cart-quantity-value"></span>
                <button class="plus">+</button>
            </div>

            <strong class="cart-line-total"></strong>
        `;

        // Visa produktinformation
        const link = `details.html?id=${encodeURIComponent(product.id)}`;

        item.querySelector(".cart-image").href = link;
        item.querySelector(".cart-image").setAttribute(
            "aria-label", `Visa ${product.title}`
        );

        item.querySelector("img").src = product.thumbnail || "";

        item.querySelector(".cart-item-title").href = link;
        item.querySelector(".cart-item-title").textContent = product.title;

        item.querySelector(".cart-unit-price").textContent =
            formatPrice(product.price) + " / st";

        item.querySelector(".cart-quantity-value").textContent =
            product.quantity;

        item.querySelector(".cart-line-total").textContent =
            formatPrice(product.price * product.quantity);

        // Ändra antal
        const minus = item.querySelector(".minus");
        const plus = item.querySelector(".plus");

        minus.setAttribute("aria-label", `Minska antal ${product.title}`);
        plus.setAttribute("aria-label", `Öka antal ${product.title}`);

        minus.disabled = product.quantity <= 1;
        plus.disabled = product.quantity >= 99;

        minus.addEventListener("click", () => {
            if (product.quantity > 1) {
                product.quantity--;
                saveCart();
            }
        });

        plus.addEventListener("click", () => {
            if (product.quantity < 99) {
                product.quantity++;
                saveCart();
            }
        });

        // Ta bort produkten
        const removeButton = item.querySelector(".cart-remove");

        removeButton.setAttribute(
            "aria-label", `Ta bort ${product.title}`
        );

        removeButton.addEventListener("click", () => {
            cart = cart.filter(item => item.id !== product.id);
            saveCart();
        });

        cartItems.append(item);
    }

    // Uppdatera totalsumman
    cartCount.textContent = totalQuantity + " varor";
    summaryCount.textContent = totalQuantity + " st";
    cartSubtotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);

    // Tom varukorg
    emptyCart.hidden = cart.length > 0;
    checkoutButton.disabled = cart.length === 0;
}

// Simulerat köp
checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    cart = [];

    if (saveCart()) {
        cartMessage.textContent =
            "Tack för ditt köp! Din beställning har genomförts.";

        setTimeout(() => {
            cartMessage.textContent = "";
        }, 5000);
    }
});

// Visa varukorgen när sidan öppnas
showCart();
