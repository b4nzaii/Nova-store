
// The base link to the DummyJSON products API
const API_URL = "https://dummyjson.com/products";

// Get data from a link and return it as JSON. This is helper function. 
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Något gick fel: " + response.status);
  }

  const data = await response.json();
  return data;
}

// Get the products from each tech category and put them together. This is main function.
async function getTechProducts() {
  const phones = await fetchJSON(API_URL + "/category/smartphones");
  const laptops = await fetchJSON(API_URL + "/category/laptops");
  const tablets = await fetchJSON(API_URL + "/category/tablets");
  const accessories = await fetchJSON(API_URL + "/category/mobile-accessories");

  const techProducts = phones.products.concat(
    laptops.products,
    tablets.products,
    accessories.products
  );

  return techProducts;
}