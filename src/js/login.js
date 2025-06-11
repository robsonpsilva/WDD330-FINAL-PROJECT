

import { signOutUser, onAuthStateChanged } from "./firebase/auth-service.js";


//const appContent = document.getElementById("app-content");
const userNameDisplay = document.getElementById("userNameDisplay");
const userPhotoDisplay = document.getElementById("userPhotoDisplay");
const logoutLink = document.getElementById("logoutLink");



// 2. Observe the authentication state (Firebase)
// This function is called EVERY TIME the login state changes (login, logout, token refresh, etc.)
onAuthStateChanged(user => {
    if (user) {
        // Usuário logado
        userNameDisplay.textContent = user.displayName || "User";
        if (user.photoURL) {
            userPhotoDisplay.src = user.photoURL;
            userPhotoDisplay.style.display = "inline-block";
        } else {
            userPhotoDisplay.style.display = "none";
        }

    } else {
        // Usuário deslogado
        console.log("User Logged Out.");
    }
});

logoutLink.addEventListener("click", () => {
    signOutUser();
    
});