
const productForm = document.querySelector("#product-form");
const formHeading = document.querySelector("#form-heading");
const titleInput = document.querySelector("#product-title");
const priceInput = document.querySelector("#product-price");
const categoryInput = document.querySelector("#product-category");
const descriptionInput = document.querySelector("#product-description");
const cancelButton = document.querySelector("#cancel-button");
const adminMessage = document.querySelector("#admin-message");
const adminList = document.querySelector("#admin-list");

// Produkterna som visas på den här sidan
let adminProducts = [];

//Vilken produkt vi redigerar och null betyder ”vi skapar en ny”
let editingId = null;

// Våra egna id:n för nya produkter, eftersom DummyJSON alltid ger 195
let nextNewId = 1000;

// Timern som döljer framgångsmeddelanden
let messageTimer = null;


///////// CRUD create, read, update, delete
/// read
// Show a message. A success message disappears after 3 seconds
function showMessage(text, isSuccess) {
  clearTimeout(messageTimer);
  adminMessage.textContent = text;

  if (isSuccess === true) {
    messageTimer = setTimeout(function () {
      adminMessage.textContent = "";
    }, 3000);
  }
}

// Send data to the API with POST, PUT or DELETE
async function sendJSON(url, method, data) {
  const options = {
    method: method,
    headers: { "Content-Type": "application/json" }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("Något gick fel: " + response.status);
  }

  return await response.json();
}

// Show all products in the list, each with Redigera and Ta bort
function showAdminProducts() {
  if (adminProducts.length === 0) {
    adminList.innerHTML = "<li>Inga produkter.</li>";
    return;
  }

  let html = "";

  for (let i = 0; i < adminProducts.length; i++) {
    const product = adminProducts[i];

    html += `
      <li class="admin-item">
        <img src="${product.thumbnail}" alt="">
        <div class="admin-info">
          <strong>${product.title}</strong>
          <span>${product.category} · ${product.price} $</span>
        </div>
        <div class="admin-buttons">
          <button class="edit-button" data-id="${product.id}" aria-label="Redigera ${product.title}">Redigera</button>
          <button class="delete-button" data-id="${product.id}" aria-label="Ta bort ${product.title}">Ta bort</button>
        </div>
      </li>
    `;
  }

  adminList.innerHTML = html;
}


// Get the products when the page opens
async function loadAdminProducts() {
  showMessage("Laddar produkter...", false);

  try {
    adminProducts = await getTechProducts();
    showAdminProducts();
    showMessage("", false);
  } catch (error) {
    showMessage("Kunde inte hämta produkterna. Försök igen senare.", false);
  }
}

// Start (keep this line at the very bottom of the file)
loadAdminProducts();
