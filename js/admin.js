
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

// R: Show all products in the list, each with Redigera and Ta bort
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


// Create
// Read the form fields and make a product object
function getFormData() {
  return {
    title: titleInput.value.trim(),
    price: Number(priceInput.value),
    category: categoryInput.value,
    description: descriptionInput.value.trim()
  };
}

// Empty the form and go back to "create" mode
function resetForm() {
  productForm.reset();
  editingId = null;
  formHeading.textContent = "Lägg till produkt";
  cancelButton.hidden = true;
}
// Create a new product with POST
async function createProduct(data) {
  showMessage("Sparar produkt...", false);

  try {
    const newProduct = await sendJSON(API_URL + "/add", "POST", data);

    // DummyJSON ger alltid id 195, så vi anger ett eget id
    newProduct.id = nextNewId;
    nextNewId = nextNewId + 1;

    // Kom ihåg att den här produkten bara finns på den här sidan
    newProduct.isNew = true;
    newProduct.thumbnail = "assets/Nova-store.png";

    adminProducts.unshift(newProduct);
    showAdminProducts();
    resetForm();
    showMessage("Produkten \"" + newProduct.title + "\" har lagts till!", true);
  } catch (error) {
    showMessage("Kunde inte spara produkten. Försök igen.", false);
  }
}
// When the form is sent: create a new product, or save changes
productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = getFormData();

  if (editingId === null) {
    createProduct(data);
  } else {
    updateProduct(editingId, data);
  }
});



// Update , PUT
// Find one product in adminProducts by its id
function findProduct(id) {
  for (let i = 0; i < adminProducts.length; i++) {
    if (adminProducts[i].id === id) {
      return adminProducts[i];
    }
  }

  return null;
}
// Put a product in the form so it can be changed
function startEditing(id) {
  const product = findProduct(id);

  if (product === null) {
    return;
  }

  editingId = id;
  titleInput.value = product.title;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  descriptionInput.value = product.description;

  formHeading.textContent = "Redigera produkt";
  cancelButton.hidden = false;
  titleInput.focus();
}
// Save changes with PUT
async function updateProduct(id, data) {
  const product = findProduct(id);

  if (product === null) {
    return;
  }

  showMessage("Sparar produkt...", false);

  try {
    // Products we created ourselves don't exist on the server
    if (product.isNew !== true) {
      await sendJSON(API_URL + "/" + id, "PUT", data);
      }

    product.title = data.title;
    product.price = data.price;
    product.category = data.category;
    product.description = data.description;

    showAdminProducts();
    resetForm();
    showMessage("Produkten har uppdaterats!", true);
  } catch (error) {
    showMessage("Kunde inte uppdatera produkten. Försök igen.", false);
  }
}

// Listen for clicks on Redigera and Ta bort in the list
adminList.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("edit-button")) {
    startEditing(id);
  }
});

// Avbryt: stop editing and empty the form
cancelButton.addEventListener("click", function () {
  resetForm();
});







// Delete







// Start (keep this line at the very bottom of the file)
loadAdminProducts();
