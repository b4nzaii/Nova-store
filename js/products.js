const productList = document.querySelector("#product-list");
const statusMessage = document.querySelector("#status-message");
const resultCount = document.querySelector("#result-count");
 
const productSearch = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const priceSort = document.querySelector("#price-sort");
 

let allProducts = [];
 

function showProducts(products) {
 
  if (products.length === 0) {
    productList.innerHTML = `
      <p class="no-results">
        Inga produkter matchar din sökning eller ditt filter.
      </p>
    `;
    return;
  }
 
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
 
        <button class="add-to-cart" data-id="${product.id}">
          Lägg i varukorg
        </button>
 
        <button class="add-to-favorites" data-id="${product.id}">
          Spara som favorit
        </button>
      </article>
    `;
  }
 
  productList.innerHTML = html;
}
 

function updateProducts() {
 
  
  const searchText = productSearch.value.trim().toLocaleLowerCase("sv-SE");
  const selectedCategory = categoryFilter.value;
  const sortOrder = priceSort.value;
 
  
  const filteredProducts = allProducts.filter((product) => {
 
    const matchesSearch = product.title
      .toLocaleLowerCase("sv-SE")
      .includes(searchText);
 
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;
 
    
    return matchesSearch && matchesCategory;
  });
 
  
  if (sortOrder === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
 
  else if (sortOrder === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
 
  
  showProducts(filteredProducts);
 
  
  resultCount.textContent =
    `Visar ${filteredProducts.length} av ${allProducts.length} produkter.`;
}
 

productSearch.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
priceSort.addEventListener("change", updateProducts);
 

async function loadProducts() {
 
  statusMessage.textContent = "Laddar produkter...";
  resultCount.textContent = "";
 
  try {
    
    allProducts = await getTechProducts();
 
    statusMessage.textContent = "";
 
   
    updateProducts();
 
  } catch (error) {
    statusMessage.textContent =
      "Kunde inte hämta produkterna. Försök igen senare.";
 
    console.error("Fel vid hämtning av produkter:", error);
  }
}
loadProducts();

// Lägg till produkt i varukorgen
productList.addEventListener("click", (event) => {

    if (event.target.classList.contains("add-to-cart")) {

        const id = Number(event.target.dataset.id);

        // Hitta produkten i produktlistan
        const product = allProducts.find(item => item.id === id);

        if (!product) return;

        // Hämta varukorgen
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Lägg till produkten
        cart.push(product);

        // Spara i localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Produkten har lagts till i varukorgen!");
    }
});
