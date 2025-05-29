import { setLocalStorage} from "./utils.mjs";
export default class ProductDetail{
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        const h3Element = document.querySelector(".product-detail h3");
        h3Element.textContent = this.product.Brand.Name;
        
        const h2Element = document.querySelector(".product-detail h2");
        h2Element.textContent = this.product.NameWithoutBrand;

        const productImageElement = document.querySelector(".product-detail img.divider");

        const imageUrls = Object.values(this.product.Images).flat();
        productImageElement.src = imageUrls[3];
        productImageElement.alt = this.product.Name;


        // Popular o preço
        const priceElement = document.querySelector(".product-detail .product-card__price");
        priceElement.textContent = `$${this.product.FinalPrice.toFixed(2)}`;
        

        
        const colorElement = document.querySelector(".product-detail .product__color");
        colorElement.textContent = this.product.Colors[0].ColorName;


        
        const descriptionElement = document.querySelector(".product-detail .product__description");
        descriptionElement.innerHTML = this.product.DescriptionHtmlSimple;


        document.getElementById("addToCart").setAttribute("data-id", this.productId);
        document.getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));

        return this.product;
    }

    getLocalStorage(key) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return null;
        }
    }

    addProductToCart(product) {
        // 1. Retrieve the existing cart data
        let cart = this.getLocalStorage("so-cart");

        // If the cart is currently empty (null or undefined), initialize it as an array
        if (!cart) {
            cart = [];
        } else {
            // If it exists, it might be a single product (from the old implementation)
            // or an array of products. Ensure it's an array.
            if (!Array.isArray(cart)) {
            cart = [cart]; // Convert the single product to an array
            }
        }

        // 2. Add the new product to the cart array
        cart.push(this. product);

        // 3. Save the updated cart data back to local storage
        setLocalStorage("so-cart", cart);
    }
}
