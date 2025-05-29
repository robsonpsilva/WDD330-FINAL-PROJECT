
let oLastModif = new Date(document.lastModified);
const modification = document.querySelector('#modification');
const currentyear = document.querySelector('#currentyear');
// use the date object
const today = new Date();
currentyear.innerHTML = `<span>${today.getFullYear()}</span>`;

let date = oLastModif.toLocaleDateString();
let hour = oLastModif.toLocaleTimeString();

lastModified.textContent = 'Last modification: ' + date + ' ' +  hour;