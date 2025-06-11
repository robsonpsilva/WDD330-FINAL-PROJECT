

import { signOutUser, onAuthStateChanged } from './firebase/auth-service.js';


//const appContent = document.getElementById("app-content");
const userNameDisplay = document.getElementById("userNameDisplay");
const userPhotoDisplay = document.getElementById("userPhotoDisplay");
const logoutLink = document.getElementById("logoutLink");




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

    } else {
        // Usuário deslogado
        console.log("Usuário deslogado.");
    }
});

logoutLink.addEventListener('click', () => {
    signOutUser();
    
});