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
export const app = initializeApp(firebaseConfig);

// 4. Obter a instância do serviço de Autenticação, passando o 'app' para ela.
// Agora, 'app' já foi inicializado e a variável existe!
export const auth = getAuth(app);

// Agora você pode usar a variável 'auth' para fazer login, logout, etc.
// Por exemplo: signInWithPopup(auth, provider);

