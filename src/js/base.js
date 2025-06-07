// No seu arquivo onde você lida com a autenticação (por exemplo, auth.js)

import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
// Importe 'app' do seu arquivo de configuração (Passo 1)
import { app } from "./utils.js"; // Ajuste o caminho conforme necessário

// Obtém a instância do Firebase Authentication
const auth = getAuth(app);

// Cria uma instância do Provedor Google
const provider = new GoogleAuthProvider();

// Opcional: Adicionar scopes adicionais (se precisar acessar outros dados do Google,
// como lista de contatos - lembre-se de solicitar apenas o necessário!)
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Opcional: Localizar o fluxo de autenticação para a língua do usuário
// auth.languageCode = 'it'; // Exemplo: Italiano
// auth.useDeviceLanguage(); // Usar a preferência de idioma do navegador



const hamButton = document.querySelector("#menu");
const navigation = document.querySelector(".comp_nav");
const listaItens = document.querySelectorAll(".comp_nav_a");


const navLinks = document.querySelectorAll('.comp_nav_a');

const loginBtn = document.getElementById('google-login-btn');




  
loginBtn.addEventListener('click', () => {
    signInWithRedirect(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Status: Conectado como ${user.displayName || user.email}`);
      overlay.style.display = 'none';
      toggleLinks(true);
      })
    .catch(() => {
      alert('Erro ao fazer login. Tente novamente.');
    });
  });

hamButton.addEventListener("click", () => {
	navigation.classList.toggle("open");
	hamButton.classList.toggle("open");
});



function closeMessage() {
  const overlay = document.getElementById('overlay');
  const messageBox = document.getElementById('message-box');

  if (overlay) overlay.style.display = 'none';
   if (messageBox) messageBox.style.display = 'none';
}


document.addEventListener("DOMContentLoaded", () => {
    listaItens.forEach(item => {
        item.addEventListener("click", () => {
            tWayFinder(item)
        });
    });
    const overlay = document.querySelector('.overlay');  
    overlay.style.display = 'flex'; 
});

function tWayFinder(item){
	listaItens.forEach(elem => {
		if (elem.textContent.trim() !== item.textContent.trim()) {
			elem.classList.remove("active");
		}
		else{
			elem.classList.add("active");
		}
	})
}

fetch("../json/hiking-places.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const cardsContainer = document.getElementById("cards-container");

    // Create cards dynamically
    let i = 1;
    data.forEach(item => {
      const card = document.createElement("article");
      card.classList.add("card");
      card.classList.add(`card${i}`);
      card.classList.add("image-container");

      card.innerHTML = `
        <h2>${item.name}</h2>
        <figure>
          <img src="${item.image}" alt="${item.name}" loading="lazy" width = "270" height = "200">
        </figure>
        <address>${item.address}</address>
        <br>
        <p class = "justified">${item.description}</p>
        <br>
        <button class = "learnmorebtn"  onclick="goToDetail(${i})">Learn More</button>
      `;
      i++;
      cardsContainer.appendChild(card);
    });
  })
  .catch(error => {
    localStorage.setItem("Err", error);
  });

  function goToDetail(number) {
    // Redireciona para a página detail com o parâmetro na URL
    window.location.href = `../details/details.html?number=${encodeURIComponent(number)}`;
  }

  function goToJoin() {
    // Redireciona para a página detail com o parâmetro na URL
    window.location.href = `../join/join.html`;
  }




  window.goToJoin = goToJoin;
  window.goToDetail = goToDetail;
  window.closeMessage = closeMessage;
