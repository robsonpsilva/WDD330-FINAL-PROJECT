import { getParam, getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";


const productID = getParam("product");
const category = getParam("category");

const dataSource = new ExternalServices(category);

const productDetails = new ProductDetails(productID, dataSource);
productDetails.init();

// function addProductToCart(product) {
//   const cartItems = getLocalStorage("so-cart") || [];
//   cartItems.push(product);
//   setLocalStorage("so-cart", cartItems);
// }

// add to cart button event handler
// async function addToCartHandler(e) {
//   const id = e.target?.dataset?.id;
//   if (!id) {
//     // console.error("No product ID found on button click!");
//     return;
//   }

//   const selectedProduct = await dataSource.findProductById(id);
  
//   productDetails.addProductToCart(selectedProduct);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
