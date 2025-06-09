// No seu arquivo onde você lida com a autenticação (auth.js)

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from './utils.js'; // Ajuste o caminho conforme necessário

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("google-login-btn");
const authStatusDiv = document.getElementById("authStatus");

if (signInButton) {
  signInButton.addEventListener('click', () => {
    // Inicia o fluxo de login com pop-up
    signInWithPopup(auth, provider)
      .then((result) => {
        // Login bem-sucedido!
        // As informações do usuário estão em result.user
        const user = result.user;
        console.log("Usuário logado:", user);

        // Você também pode obter um token de acesso do Google para acessar APIs do Google
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log("Access Token do Google:", accessToken);

        // E o ID token do Firebase (para autenticar no seu backend, se tiver)
        user.getIdToken().then(idToken => {
            console.log("Firebase ID Token:", idToken);
        });

        authStatusDiv.textContent = `Status: Conectado como ${user.displayName || user.email}`;
        // Atualize sua UI (esconda o botão de login, mostre conteúdo para usuários logados, etc.)

      })
      .catch((error) => {
        // Ocorreu um erro durante o login
        const errorCode = error.code;
        const errorMessage = error.message;
        // O email da conta do usuário usada
        const email = error.customData ? error.customData.email : null;
        // O tipo de credencial do Auth, para reautenticação
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Erro no login com Google:", errorCode, errorMessage);
        authStatusDiv.textContent = `Status: Erro no login - ${errorMessage}`;

        // Lide com erros específicos, por exemplo, se o pop-up foi fechado
        if (errorCode === 'auth/popup-closed-by-user') {
            console.log("Login pop-up fechado pelo usuário.");
            authStatusDiv.textContent = "Status: Login cancelado.";
        }
      });
  });
}

function showMessage() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex'; // Torna a overlay visível e usa flex para centralizar
    // Adiciona uma pequena espera para a transição CSS (opcional, para melhor UX)
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

// Função para esconder a overlay
function closeMessage() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('show'); // Remove a classe para a animação de saída
    // Espera a animação CSS terminar antes de esconder totalmente o display
    setTimeout(() => {
        overlay.style.display = 'none'; // Esconde a overlay
    }, 300); // Deve ser igual ou maior que a duração da transição (0.3s)
}

document.addEventListener("DOMContentLoaded",showMessage());

window.closeMessage = closeMessage;

// Opcional: Adicionar scopes adicionais (se precisar acessar outros dados do Google,
// como lista de contatos - lembre-se de solicitar apenas o necessário!)
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Opcional: Localizar o fluxo de autenticação para a língua do usuário
// auth.languageCode = 'it'; // Exemplo: Italiano
// auth.useDeviceLanguage(); // Usar a preferência de idioma do navegador









// // No seu arquivo onde você lida com a autenticação (por exemplo, auth.js)

// import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
// // Importe 'app' do seu arquivo de configuração (Passo 1)
// import { app } from "./utils.js"; // Ajuste o caminho conforme necessário


// const auth = getAuth(app);
// const authStatusDiv = document.getElementById('authStatus');

// const provider = new GoogleAuthProvider();

// auth.useDeviceLanguage(); // Usar a preferência de idioma do navegador

// const loginBtn = document.getElementById('google-login-btn');


// function startLogin() {
//   signInWithRedirect(auth, provider);
// }

// loginBtn.addEventListener('click', () => {
//     startLogin();
// });

// document.addEventListener("DOMContentLoaded", () => {
//     overlay.style.display = "flex";
// });


// function closeMessage() {
//   const overlay = document.getElementById('overlay');
//   const messageBox = document.getElementById('message-box');

//   if (overlay) overlay.style.display = 'none';
//    if (messageBox) messageBox.style.display = 'none';
// }


// // No seu arquivo onde você lida com o resultado do redirecionamento (geralmente a página onde você chamou signInWithRedirect)

// // Chame getRedirectResult() quando sua página carregar para ver se o usuário acabou de fazer login via redirect
// getRedirectResult(auth)
//   .then((result) => {
//     if (result) {
//       // O usuário acabou de fazer login via redirecionamento!
//       const user = result.user;
//       console.log("Usuário logado via redirecionamento:", user);

//       // --- AQUI É ONDE VOCÊ REDIRECIONA PARA A PÁGINA DESEJADA ---
//       console.log("Login bem-sucedido! Redirecionando para a página de dashboard...");
//       // Por exemplo, redirecionar para '/dashboard.html'
//       window.location.assign('./index.html'); // Use window.location.replace() se não quiser que a página anterior fique no histórico

//       // Note: O código abaixo (atualizar authStatusDiv) só será executado brevemente antes do redirecionamento
//       // ou se algo impedir o redirecionamento. A lógica principal pós-login deve ser o redirecionamento.
//       authStatusDiv.textContent = `Status: Conectado como ${user.displayName || user.email} - Redirecionando...`;

//     } else {
//       // Ninguém logado, ou o usuário não veio de um redirecionamento de login
//       console.log("Nenhum resultado de redirecionamento encontrado ou usuário já logado.");
//       authStatusDiv.textContent = "Status: Desconectado (ou já logado)";
//       // Sua UI deve refletir o estado atual (ver a lógica onAuthStateChanged)
//     }
//   })
//   .catch((error) => {
//     // Ocorreu um erro no redirecionamento
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.error("Erro no login via redirecionamento:", errorCode, errorMessage);
//     authStatusDiv.textContent = `Status: Erro no login - ${errorMessage}`;
//     // Lide com o erro
//   });

// // Lógica para o botão signInWithGoogle ainda seria necessária para INICIAR o fluxo
// // ... (código do Passo 3 para signInWithRedirect) ...

//   // });

//   //  try{
//   //     const overlay = document.querySelector(".overlay");  
//   //     overlay.style.display = "flex"; 

      
//   //   });

//   //   const result = await getRedirectResult(auth);
//   //   if (result){
//   //      overlay.style.display = "none"
//   //   }
//   // }
//   // catch (error) {
//   //   alert(`Login error!`);
//   // }
  
//   //   const result = await getRedirectResult(auth);
//   //   const logedIn = localStorage.getItem("logedIn");

//   //   if (logedIn == false || logedIn == null){
//   //     const overlay = document.querySelector('.overlay');  
//   //     overlay.style.display = 'flex';  
//   //   }
//   //   else{
//   //     overlay.style.display = 'none'; 
//   //   }


//  window.closeMessage = closeMessage;







