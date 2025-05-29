
  export function finalizePurchase(cart) {
    // Converte o carrinho em JSON e salva no Local Storage
    const cartJson = JSON.stringify(cart);
    localStorage.setItem('cart', cartJson); // Salva o carrinho no Local Storage com a chave 'cart'
  
    // Atualiza o resumo do carrinho na página
    const cartSummary = document.getElementById('cart-summary');
    cartSummary.innerHTML = `
      <h3>Thank you for your purchase!</h3>
      <p>Your order has been placed successfully.</p>
    `;
  }