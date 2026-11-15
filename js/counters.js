// visar antal varor på korgikonen, körs på alla sidor

// räkna alla varor, inte rader! (2 iPhone = 2)
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
        // ingen quantity? (från produktsidan) då är det 1 st
        if (cart[i].quantity) {
            count = count + cart[i].quantity;
        } else {
            count = count + 1;
        }
    }

    return count;
}

// uppdatera siffran + texten för skärmläsare
function updateCartBadge() {
    const badge = document.querySelector("#cart-badge");
    const cartLink = document.querySelector(".header-cart");

    // ingen ikon på sidan? gör inget
    if (badge === null || cartLink === null) {
        return;
    }

    const count = getCartCount();

    badge.textContent = count;
    badge.hidden = count === 0; // 0 = dölj
    cartLink.setAttribute("aria-label", "Varukorg, " + count + " varor");
}

// kör direkt när sidan laddas
updateCartBadge();