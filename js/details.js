const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetails = document.querySelector("#product-details");

async function showProduct() {
    try {
        if (!productId) {
            throw new Error("Produkten hittades inte");
        }

        const product = await fetchJSON(`https://dummyjson.com/products/${productId}`);

        productDetails.innerHTML = `
            <div class="product-card">
                <img src="${product.thumbnail}" alt="${product.title}">

                <h2>${product.title}</h2>

                <p>${product.description}</p>

                <p>Kategori: ${product.category}</p>

                <p>Pris: ${product.price} $</p>

                <p>Betyg: ${product.rating}</p>

                <button class="add-to-cart-button">
                    Lägg till i varukorg
                </button>
            </div>
        `;

        document.querySelector(".add-to-cart-button").addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push(product);

            localStorage.setItem("cart", JSON.stringify(cart));

            alert("Produkten har lagts till i varukorgen!");
        });

    } catch (error) {
        productDetails.textContent = "Kunde inte hämta produkten. Försök igen senare.";
    }
}

showProduct();
