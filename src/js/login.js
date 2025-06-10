

import { signInWithGoogle, handleRedirectResult, signOutUser, onAuthStateChanged } from './firebase/auth-service.js';

// --- Elementos do DOM ---
const loginOverlay = document.getElementById("login-overlay");
const googleLoginBtn = document.getElementById("google-login-btn");
const closeOverlayBtn = document.getElementById("close-overlay-btn");
//const appContent = document.getElementById("app-content");
const userNameDisplay = document.getElementById("userNameDisplay");
const userPhotoDisplay = document.getElementById("userPhotoDisplay");
const logoutLink = document.getElementById("logoutLink");

// --- Funções da Overlay ---
function showOverlay() {
   // loginOverlay.classList.remove('hidden'); // Remove a classe 'hidden' para mostrar
}

function hideOverlay() {
    loginOverlay.classList.add('hidden'); // Adiciona a classe 'hidden' para ocultar com transição
    // Opcional: Remover o elemento do DOM depois da transição para acessibilidade e performance
    // setTimeout(() => {
    //     loginOverlay.style.display = 'none';
    // }, 300); // tempo da transição
}

// --- Event Listeners ---
googleLoginBtn.addEventListener('click', () => {
    //hideOverlay(); // Esconde a overlay antes de redirecionar para o Google
    signInWithGoogle(); // Inicia o fluxo de login com o Google
});

closeOverlayBtn.addEventListener('click', () => {
    hideOverlay(); // Apenas esconde a overlay se o usuário não quiser logar
    // Você pode adicionar lógica aqui para o que acontece se o usuário fechar a overlay
    // sem logar (ex: mostrar conteúdo limitado, redirecionar para outro lugar)
});




// --- Lógica Principal da Aplicação ---

// 1. Lidar com o resultado do redirecionamento (Executado no carregamento da página)
// É crucial chamar handleRedirectResult no carregamento, pois é quando o Firebase
// verifica se a página está retornando de um login por redirecionamento.
document.addEventListener('DOMContentLoaded', async () => {
    const redirectResult = await handleRedirectResult();
    if (redirectResult && redirectResult.success) {
        console.log("Login por redirecionamento concluído. O onAuthStateChanged será acionado.");
        // Não é preciso fazer mais nada aqui, o onAuthStateChanged cuidará da UI
    } else if (redirectResult && !redirectResult.success) {
        console.error("Erro no login por redirecionamento:", redirectResult.error);
        alert(`Não foi possível completar o login: ${redirectResult.error.message}`);
        showOverlay(); // Se houver erro, mostre a overlay novamente
    }
    // Se não houve redirecionamento ou um erro, o onAuthStateChanged lidará com o estado atual.
});


// 2. Observar o estado de autenticação (Firebase)
// Esta função é chamada SEMPRE que o estado de login muda (login, logout, token refresh, etc.)
onAuthStateChanged(user => {
    if (user) {
        // Usuário logado
        console.log("Usuário logado:", user);
        userNameDisplay.textContent = user.displayName || 'Usuário';
        if (user.photoURL) {
            userPhotoDisplay.src = user.photoURL;
            userPhotoDisplay.style.display = 'inline-block';
        } else {
            userPhotoDisplay.style.display = 'none';
        }

        hideOverlay(); // Garante que a overlay de login esteja oculta
        //appContent.style.display = 'block'; // Mostra o conteúdo da aplicação
    } else {
        // Usuário deslogado
        console.log("Usuário deslogado.");
        //appContent.style.display = 'none'; // Esconde o conteúdo da aplicação
        showOverlay(); // Mostra a overlay de login
    }
});

logoutLink.addEventListener('click', () => {
    signOutUser();
    showOverlay();
});