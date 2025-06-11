// src/auth-service.js

import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";
import { auth } from './firebase-config.js';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Inicia o processo de login com Google usando redirecionamento.
 */
export async function signInWithGoogle() {
  try {
    await signInWithRedirect(auth, provider);
    // O navegador será redirecionado para a página de login do Google.
  } catch (error) {
    console.error("Erro ao iniciar redirecionamento de login:", error.code, error.message);
    // Aqui você pode mostrar uma mensagem de erro na UI se o erro acontecer antes do redirecionamento
    alert(`Erro ao iniciar login: ${error.message}`);
  }
}

/**
 * Obtém o resultado do redirecionamento de login.
 * Deve ser chamado no carregamento da página para onde o Google redireciona de volta.
 * @returns {Promise<Object|null>} Retorna um objeto com dados do usuário se o login foi bem-sucedido, ou null.
 */
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      // O ID Token é crucial para seu backend
      const idToken = await user.getIdToken();
      console.log("Login com Google via Redirect processado com sucesso!", user);
      console.log("ID Token para o backend:", idToken);

      // --- IMPORTANTE: ENVIE O idToken PARA O SEU BACKEND AQUI PARA VALIDAÇÃO E CRIAÇÃO DE SESSÃO ---
      // Exemplo (apenas para demonstração, substitua pela sua lógica real):
      // const backendResponse = await fetch('/api/auth/google-verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id_token: idToken })
      // });
      // const sessionData = await backendResponse.json();
      // console.log("Resposta do backend:", sessionData);
      // Fazer algo com a sessão criada pelo seu backend

      return { success: true, user, idToken };
    } else {
      return null; // Nenhum resultado de redirecionamento pendente
    }
  } catch (error) {
    console.error("Erro ao processar resultado do redirecionamento:", error.code, error.message);
    return { success: false, error: { code: error.code, message: error.message } };
  }
}

/**
 * Realiza o logout do usuário.
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("Logout bem-sucedido.");
    window.location.href = "../index.html";
    // onAuthStateChanged irá detectar a mudança e atualizar a UI
  } catch (error) {
    console.error("Erro no logout:", error.code, error.message);
    alert(`Erro ao fazer logout: ${error.message}`);
  }
}

/**
 * Observa mudanças no estado de autenticação do Firebase.
 * @param {Function} callback A função a ser chamada com o objeto 'user' ou 'null'.
 * @returns {Function} Uma função para cancelar o observador.
 */
export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}