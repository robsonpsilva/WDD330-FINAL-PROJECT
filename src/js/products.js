export let products = []; 

//--------------FetchData----------------------------------------------------
// The following function loads the data contained in the products.json file, 
// product data, and then calls the displayProducts function to display 
// it on the screen.

export async function fetchProducts() {
  try {
    const response = await fetch("../json/products.json");
    products = await response.json();
    displayProducts();
  } catch (error) {
    localStorage.setItem("Err", error);
    console.error("Error fetching products:", error);
  }
}

// The following function manipulates the DOM and displays the 
// products, as cards, on the screen.

export function displayProducts() {
  const productList = document.getElementById("product-list");
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "sell-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h2>${product.name}</h2>
      <p>Price: $${product.price.toFixed(2)}</p>
      <label for="quantity-${product.id}">Quantity:</label>
      <input type="number" id="quantity-${product.id}" min="1" value="1">
      <br><br>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}