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
firebase.initializeApp(firebaseConfig);

// Referências aos serviços do Firebase que vamos usar
const auth = firebase.auth();
const db = firebase.firestore(); // Opcional: para salvar/recuperar dados do usuário

// Referências aos elementos HTML
const authSection = document.getElementById('auth-section');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const dashboardSection = document.getElementById('dashboard-section');

const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const btnRegister = document.getElementById('btn-register');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const btnLogin = document.getElementById('btn-login');
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnResetPassword = document.getElementById('btn-reset-password');

const btnLogout = document.getElementById('btn-logout');
const btnDeleteAccount = document.getElementById('btn-delete-account');

const userEmailSpan = document.getElementById('user-email');
const userUidSpan = document.getElementById('user-uid');
const userDisplayNameSpan = document.getElementById('user-display-name');

const showLoginLink = document.getElementById('show-login');
const showRegisterLink = document.getElementById('show-register');


// --- Funções de UI ---
function showDashboard(user) {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userEmailSpan.textContent = user.email || 'N/A';
    userUidSpan.textContent = user.uid;
    userDisplayNameSpan.textContent = user.displayName || 'Não definido';

    window.location.href = "./home.html";
    
}

function showAuthForms() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    loginForm.classList.remove('hidden'); // Volta para o login por padrão
    registerForm.classList.add('hidden');
    userEmailSpan.textContent = '';
    userUidSpan.textContent = '';
    userDisplayNameSpan.textContent = '';
}

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});


// --- Funções de Autenticação ---

// Registrar novo usuário com Email/Senha
btnRegister.addEventListener('click', async () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    if (!email || !password) {
        alert('Por favor, preencha email e senha para registrar.');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        alert(`Usuário ${user.email} registrado com sucesso!`);

        // Opcional: Salvar alguns dados básicos no Firestore após o registro
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Dados do usuário salvos no Firestore.");

        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        console.error("Erro ao registrar:", error.code, error.message);
        alert(`Erro ao registrar: ${error.message}`);
    }
});

// Login com Email/Senha
btnLogin.addEventListener('click', async () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    if (!email || !password) {
        alert('Por favor, preencha email e senha para fazer login.');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        alert(`Usuário ${user.email} logado com sucesso!`);
        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        console.error("Erro ao fazer login:", error.code, error.message);
        alert(`Erro ao fazer login: ${error.message}`);
    }
});

// Login com Google
btnGoogleLogin.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        

        // Opcional: Salvar dados do usuário Google no Firestore se for um novo usuário
        const userDocRef = db.collection('users').doc(user.uid);
        const doc = await userDocRef.get();
        if (!doc.exists) {
            await userDocRef.set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providerId: result.credential.providerId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Dados do usuário Google salvos no Firestore.");
        }
        // `onAuthStateChanged` vai lidar com a exibição do dashboard
    } catch (error) {
        console.error("Erro ao fazer login com Google:", error.code, error.message);
        alert(`Erro ao fazer login com Google: ${error.message}`);
    }
});

// Esqueci a Senha
btnResetPassword.addEventListener('click', async () => {
    const email = loginEmailInput.value; // Pega o email do campo de login
    if (!email) {
        alert('Por favor, digite seu email no campo de login para redefinir a senha.');
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        alert(`Um email para redefinir a senha foi enviado para ${email}.`);
    } catch (error) {
        console.error("Erro ao redefinir senha:", error.code, error.message);
        alert(`Erro ao redefinir senha: ${error.message}`);
    }
});


// Sair (Logout)
btnLogout.addEventListener('click', async () => {
    try {
        await auth.signOut();
        alert('Sessão encerrada com sucesso!');
        // `onAuthStateChanged` vai lidar com a exibição dos formulários de autenticação
    } catch (error) {
        console.error("Erro ao fazer logout:", error.code, error.message);
        alert(`Erro ao fazer logout: ${error.message}`);
    }
});

// Excluir Conta
btnDeleteAccount.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
        alert('Nenhum usuário logado para excluir.');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir a conta de ${user.email}? Esta ação é irreversível!`)) {
        try {
            // A reautenticação pode ser necessária se a última autenticação foi há muito tempo
            // Para simplicidade, não vamos reautenticar aqui, mas em produção, considere:
            // const credential = firebase.auth.EmailAuthProvider.credential(user.email, prompt("Digite sua senha novamente para confirmar:"));
            // await user.reauthenticateWithCredential(credential);

            await user.delete();

            // Opcional: Remover dados do usuário do Firestore
            await db.collection('users').doc(user.uid).delete().catch(e => {
                console.warn("Erro ao deletar dados do Firestore, mas a conta foi excluída:", e);
            });

            alert('Sua conta foi excluída com sucesso!');
            // `onAuthStateChanged` vai lidar com a exibição dos formulários de autenticação
        } catch (error) {
            console.error("Erro ao excluir conta:", error.code, error.message);
            if (error.code === 'auth/requires-recent-login') {
                alert('Por segurança, por favor, faça login novamente para excluir sua conta. (Autentique-se mais recentemente)');
                // Você pode forçar o logout aqui e pedir para o usuário logar novamente
                auth.signOut();
            } else {
                alert(`Erro ao excluir conta: ${error.message}`);
            }
        }
    }
});


// --- Listener de Estado de Autenticação ---
// Isso é crucial! Ele detecta se o usuário está logado ou não e atualiza a UI.
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        console.log("Usuário logado:", user);
        showDashboard(user);
    } else {
        // Usuário não está logado
        console.log("Nenhum usuário logado.");
        showAuthForms();
    }
});

// Inicializa a UI mostrando o formulário de login por padrão se ninguém estiver logado
// Isso será ajustado pelo onAuthStateChanged logo que o script carregar
showAuthForms();