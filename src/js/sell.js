import { fetchProducts, products } from './products.js';
import { addToCart, updateCartSummary, cart } from './cart.js';
import { finalizePurchase } from './purchase.js';

// Inicializa os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
});

// Exporta funções globais usadas por eventos onclick
window.addToCart = (productId) => addToCart(productId, products);
window.finalizePurchase = () => finalizePurchase(cart);