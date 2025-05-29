import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageUrls = Object.values(product.Images).flat();
  if (product.FinalPrice < product.SuggestedRetailPrice){
     return `
        <li class="product-card">
          <a href="../product_pages/index.html?product=${product.Id}&category=${product.Category}">
            <img src="${imageUrls[1]}" alt="${product.Name}">
            <h2>${product.Brand.Name}</h2>
            <h3>${product.Name}</h3>
            <p class="product-card__price">$${product.FinalPrice}</p>
            <p class="product-card__price">discount of: $${Number((product.SuggestedRetailPrice - product.FinalPrice).toPrecision(4))}</p>
          </a>
        </li>
    `; 
  }
  else {
    return `
      <li class="product-card">
        <a href="../product_pages/index.html?product=${product.Id}&category=${product.Category}">
          <img src="${imageUrls[1]}" alt="${product.Name}">
          <h2>${product.Brand.Name}</h2>
          <h3>${product.Name}</h3>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </li>
      `;
  }
  
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}