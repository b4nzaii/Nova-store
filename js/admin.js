const productForm = document.querySelector("#product-form");
const formHeading = document.querySelector("#form-heading");
const titleInput = document.querySelector("#product-title");
const priceInput = document.querySelector("#product-price");
const categoryInput = document.querySelector("#product-category");
const descriptionInput = document.querySelector("#product-description");
const cancelButton = document.querySelector("#cancel-button");
const adminMessage = document.querySelector("#admin-message");
const adminList = document.querySelector("#admin-list");

let adminProducts = [];
let editingId = null;
let nextNewId = 1000;
let messageTimer = null;


function showMessage(text, isSuccess) {
  clearTimeout(messageTimer);
  adminMessage.textContent = text;

  if (isSuccess === true) {
    messageTimer = setTimeout(function () {
      adminMessage.textContent = "";
    }, 3000);
  }
}


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


function getFormData() {
  return {
    title: titleInput.value.trim(),
    price: Number(priceInput.value),
    category: categoryInput.value,
    description: descriptionInput.value.trim()
  };
}


function resetForm() {
  productForm.reset();
  editingId = null;
  formHeading.textContent = "Lägg till produkt";
  cancelButton.hidden = true;
}

async function createProduct(data) {
  showMessage("Sparar produkt...", false);

  try {
    const newProduct = await sendJSON(API_URL + "/add", "POST", data);


    newProduct.id = nextNewId;
    nextNewId = nextNewId + 1;


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

productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = getFormData();

  if (editingId === null) {
    createProduct(data);
  } else {
    updateProduct(editingId, data);
  }
});

function findProduct(id) {
  for (let i = 0; i < adminProducts.length; i++) {
    if (adminProducts[i].id === id) {
      return adminProducts[i];
    }
  }

  return null;
}

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

async function updateProduct(id, data) {
  const product = findProduct(id);

  if (product === null) {
    return;
  }

  showMessage("Sparar produkt...", false);

  try {

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


adminList.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("edit-button")) {
    startEditing(id);
  }
});


cancelButton.addEventListener("click", function () {
  resetForm();
});


async function deleteProduct(id) {
  const product = findProduct(id);
  if (product === null) {
    return;
  }
  const sure = confirm("Är du säker på att du vill ta bort \"" + product.title + "\"?");
  if (sure === false) {
    return;
  }
  showMessage("Tar bort produkt...", false);
  try {

    if (product.isNew !== true) {
      await sendJSON(API_URL + "/" + id, "DELETE");
    }

    const newList = [];
    for (let i = 0; i < adminProducts.length; i++) {
      if (adminProducts[i].id !== id) {
        newList.push(adminProducts[i]);
      }
    }
    adminProducts = newList;


    if (editingId === id) {
      resetForm();
    }
    showAdminProducts();
    showMessage("Produkten har tagits bort.", true);
  } catch (error) {
    showMessage("Kunde inte ta bort produkten. Försök igen.", false);
  }
}

adminList.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);
  if (event.target.classList.contains("edit-button")) {
    startEditing(id);
  }
  if (event.target.classList.contains("delete-button")) {
    deleteProduct(id);
  }
});

loadAdminProducts();
