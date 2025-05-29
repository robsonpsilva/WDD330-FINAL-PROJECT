export let products = []; // Exporta a lista de produtos

export async function fetchProducts() {
  try {
    const response = await fetch('./data/products.json');
    products = await response.json();
    displayProducts();
  } catch (error) {
    localStorage.setItem("Err", error);
    console.error('Error fetching products:', error);
  }
}

export function displayProducts() {
  const productList = document.getElementById('product-list');
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
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