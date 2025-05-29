export const cart = []; // Exporta o carrinho

export function addToCart(productId, products) {
  const quantity = document.getElementById(`quantity-${productId}`).value;
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    cartItem.quantity += parseInt(quantity);
  } else {
    cart.push({ ...product, quantity: parseInt(quantity) });
  }

  updateCartSummary();
}

export function updateCartSummary() {
  const cartSummary = document.getElementById('cart-summary');
  cartSummary.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}