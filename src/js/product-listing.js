import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

import {getParam} from "./utils.mjs";

const category = getParam("category");

const dataSource = new ExternalServices(category);
const listHeader = document.querySelector(".topHeader");
listHeader.textContent = "Top Products: " + category.charAt(0).toUpperCase() + category.slice(1);

const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);

productList.init();
