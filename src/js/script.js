// PASSO 1: Configuração do Firebase
// SUBSTITUA PELAS SUAS PRÓPRIAS CREDENCIAIS DO FIREBASE!
const firebaseConfig = {
  apiKey: "AIzaSyAmjX1gTePVlFnG74opBb8dTuNA16vFzUA",
  authDomain: "wdd330-3c8bb.firebaseapp.com",
  projectId: "wdd330-3c8bb",
  storageBucket: "wdd330-3c8bb.firebasestorage.app",
  messagingSenderId: "391066383588",
  appId: "1:391066383588:web:8c8ae49550322e4ae568f1",
  measurementId: "G-FVP68CN8TW"
};

// Inicializa o Firebase
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Referências aos serviços do Firebase que vamos usar
// eslint-disable-next-line no-undef
const auth = firebase.auth();
// eslint-disable-next-line no-undef
const db = firebase.firestore(); // Opcional: para salvar/recuperar dados do usuário

// Referências aos elementos HTML
const authSection = document.getElementById("login-auth-section");
const registerForm = document.getElementById("login-register-form");
const loginForm = document.getElementById("login-form");
const dashboardSection = document.getElementById("dashboard-section");

const registerEmailInput = document.getElementById("login-register-email");
const registerPasswordInput = document.getElementById("login-register-password");
const btnRegister = document.getElementById("login-btn-register");

const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const btnLogin = document.getElementById("btn-login");
const btnGoogleLogin = document.getElementById("btn-google-login");
const btnResetPassword = document.getElementById("login-btn-reset-password");

const btnLogout = document.getElementById("btn-logout");
const btnDeleteAccount = document.getElementById("btn-delete-account");

const userEmailSpan = document.getElementById("login-user-email");
const userUidSpan = document.getElementById("login-user-uid");
const userDisplayNameSpan = document.getElementById("login-user-display-name");

const showLoginLink = document.getElementById("login-show");
const showRegisterLink = document.getElementById("show-register");

const customAlertModal = document.getElementById("custom-alert-modal");
const customAlertMessage = document.getElementById("custom-alert-message");
const customAlertOkButton = document.getElementById("custom-alert-ok-button");

function showCustomAlert(message) {
    customAlertMessage.textContent = message;
    customAlertModal.classList.remove("hidden"); // Exibe a modal
}
if (customAlertOkButton) {
    customAlertOkButton.addEventListener("click", () => {
        customAlertModal.classList.add("hidden"); // Esconde a modal
    });
}

// --- Funções de UI ---
function showDashboard(user) {
    authSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    userEmailSpan.textContent = user.email || "N/A";
    userUidSpan.textContent = user.uid;
    userDisplayNameSpan.textContent = user.displayName || "Not defined";

    window.location.href = "./home.html";
    
}

function showAuthForms() {
    authSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    loginForm.classList.remove("hidden"); // Volta para o login por padrão
    registerForm.classList.add("hidden");
    userEmailSpan.textContent = "";
    userUidSpan.textContent = "";
    userDisplayNameSpan.textContent = "";
}

showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
});

showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
});


// --- Funções de Autenticação ---

// Registrar novo usuário com Email/Senha
btnRegister.addEventListener("click", async () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    if (!email || !password) {
        showCustomAlert("Please fill in email and password to register.");
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        showCustomAlert(`User ${user.email} registered successfully!`);

        // Opcional: Salvar alguns dados básicos no Firestore após o registro
        await db.collection("users").doc(user.uid).set({
            email: user.email,
            // eslint-disable-next-line no-undef
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        

        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        
        showCustomAlert(`Error registering: ${error.message}`);
    }
});

// Login com Email/Senha
btnLogin.addEventListener("click", async () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    if (!email || !password) {
        showCustomAlert("Please fill in your email and password to login.");
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        showCustomAlert(`User ${user.email} logged in successfully!`);
        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        showCustomAlert(`Error logging in:: ${error.message}`);
    }
});

// Login com Google
btnGoogleLogin.addEventListener("click", async () => {
    // eslint-disable-next-line no-undef
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        

        // Opcional: Salvar dados do usuário Google no Firestore se for um novo usuário
        const userDocRef = db.collection("users").doc(user.uid);
        const doc = await userDocRef.get();
        if (!doc.exists) {
            await userDocRef.set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providerId: result.credential.providerId,
                // eslint-disable-next-line no-undef
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        showCustomAlert(`Error logging in with Google: ${error.message}`);
    }
});

// Esqueci a Senha
btnResetPassword.addEventListener("click", async () => {
    const email = loginEmailInput.value; // Pega o email do campo de login
    if (!email) {
        showCustomAlert("Please enter your email in the login field to reset your password.");
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        showCustomAlert(`An email to reset your password has been sent to ${email}.`);
    } catch (error) {
        showCustomAlert(`Error resetting password: ${error.message}`);
    }
});


// Sair (Logout)
btnLogout.addEventListener("click", async () => {
    try {
        await auth.signOut();
        showCustomAlert("Session ended successfully!");
        // `onAuthStateChanged` vai lidar com a exibição dos formulários de autenticação
    } catch (error) {
        showCustomAlert(`Error logging out: ${error.message}`);
    }
});

// Excluir Conta
btnDeleteAccount.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        showCustomAlert("No logged in users to delete.");
        return;
    }

    if (confirm(`Are you sure you want to delete the account? ${user.email}? This action is irreversible!`)) {
        try {
            // A reautenticação pode ser necessária se a última autenticação foi há muito tempo
            // Para simplicidade, não vamos reautenticar aqui, mas em produção, considere:
            // const credential = firebase.auth.EmailAuthProvider.credential(user.email, prompt("Digite sua senha novamente para confirmar:"));
            // await user.reauthenticateWithCredential(credential);

            await user.delete();

            // Opcional: Remover dados do usuário do Firestore
            await db.collection("users").doc(user.uid).delete().catch(e => {
                console.warn("Error deleting data from Firestore, but account was deleted:", e);
            });

            showCustomAlert("Your account has been deleted successfully!");
            // `onAuthStateChanged` vai lidar com a exibição dos formulários de autenticação
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                showCustomAlert("For security, please log in again to delete your account. (Log in more recently)");
                // Você pode forçar o logout aqui e pedir para o usuário logar novamente
                auth.signOut();
            } else {
                showCustomAlert(`Error deleting account: ${error.message}`);
            }
        }
    }
});


// --- Listener de Estado de Autenticação ---
// Isso é crucial! Ele detecta se o usuário está logado ou não e atualiza a UI.
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        showDashboard(user);
    } else {
        // Usuário não está logado
        showAuthForms();
    }
});

// Inicializa a UI mostrando o formulário de login por padrão se ninguém estiver logado
// Isso será ajustado pelo onAuthStateChanged logo que o script carregar
showAuthForms();