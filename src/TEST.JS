// 1. Importar as funções necessárias
import { initializeApp } from "firebase/app"; // Para inicializar o Firebase App
import { getAuth } from "firebase/auth";     // Para obter o serviço de autenticação

// 2. Sua configuração do projeto Firebase (substitua pelos seus dados reais)
// TODO: Substitua o seguinte pela configuração do seu projeto Firebase
// Veja: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAmjX1gTePVlFnG74opBb8dTuNA16vFzUA",
  authDomain: "wdd330-3c8bb.firebaseapp.com",
  projectId: "wdd330-3c8bb",
  storageBucket: "wdd330-3c8bb.firebasestorage.app",
  messagingSenderId: "391066383588",
  appId: "1:391066383588:web:8c8ae49550322e4ae568f1",
  measurementId: "G-FVP68CN8TW"
};

// 3. Inicializar o Firebase App
// Esta chamada retorna a instância do seu app Firebase, que é salva na variável 'app'.
const app = initializeApp(firebaseConfig);

// 4. Obter a instância do serviço de Autenticação, passando o 'app' para ela.
// Agora, 'app' já foi inicializado e a variável existe!
const auth = getAuth(app);

// Agora você pode usar a variável 'auth' para fazer login, logout, etc.
// Por exemplo: signInWithPopup(auth, provider);



// No seu arquivo onde você lida com a autenticação (auth.js)

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from './firebase-config'; // Ajuste o caminho conforme necessário

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById('signInWithGoogle');
const authStatusDiv = document.getElementById('authStatus');

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

