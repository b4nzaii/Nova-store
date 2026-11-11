// Hitta elementen på sidan
const productList = document.querySelector("#product-list");
const statusMessage = document.querySelector("#status-message");

// Visa produkterna som kort
function showProducts(products) {
  let html = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    html += `
      <article class="product-card">
        <img src="${product.thumbnail}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.category}</p>
        <p class="price">${product.price} $</p>
        <a href="details.html?id=${product.id}">Visa mer</a>
        <button class="add-to-cart" data-id="${product.id}">Lägg i varukorg</button>
        <button class="add-to-favorites" data-id="${product.id}">Spara som favorit</button>
      </article>
    `;
  }

  productList.innerHTML = html;
}

// Hämta produkterna och visa upp dem
async function loadProducts() {
  statusMessage.textContent = "Laddar produkter...";

  try {
    const products = await getTechProducts();
    showProducts(products);
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = "Kunde inte hämta produkterna. Försök igen senare.";
  }
}

// Starta när sidan öppnas
loadProducts();