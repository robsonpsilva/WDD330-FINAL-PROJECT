import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const cartFooter = document.querySelector(".cart-footer");
  const totalElement = document.querySelector(".cart-total");

  if (Array.isArray(cartItems) && cartItems.length > 0) {
    const htmlItems = cartItems.map((item, index) =>
      cartItemTemplate(item, index),
    );
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    const totalListPrice = setTotal(cartItems);
    totalElement.textContent = `Total: $${totalListPrice}`;

    cartFooter.classList.remove("hide");
    setupRemoveButtons();
  } else {
    document.querySelector(".product-list").innerHTML =
      "<li>Your cart is empty 🛒😢</li>";

    // Clear the total
    totalElement.textContent = "";

    // Hide the footer
    cartFooter.classList.add("hide");
  }
}

function setTotal(items) {
  let total = 0;
  for (const item of items) {
    if (item && typeof item.FinalPrice === "number") {
      total += item.FinalPrice;
    }
  }
  return total.toFixed(2);
}

function cartItemTemplate(item, index) {
  const imageUrls = Object.values(item.Images).flat();
  return `<li class="cart-card divider">
    <button class="remove-btn" data-index="${index}">❌ Remove</button>
    <a href="#" class="cart-card__image">
      <img src="${imageUrls[2]}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function setupRemoveButtons() {
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      let cart = getLocalStorage("so-cart") || [];
      cart.splice(index, 1); // remove the item at the clicked index
      setLocalStorage("so-cart", cart);
      renderCartContents(); // re-render the cart
    });
  });
}

renderCartContents();
