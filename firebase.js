// 🔥 IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 TU CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBDAOW-qrvxTcJVM4QNWPQvrmbz8wcAQLM",
  authDomain: "trujillo-digital-hub.firebaseapp.com",
  projectId: "trujillo-digital-hub",
  storageBucket: "trujillo-digital-hub.firebasestorage.app",
  messagingSenderId: "162799375782",
  appId: "1:162799375782:web:2be9127bfeaa613fd6ab67"
};

// 🔥 INICIALIZAR
const app = initializeApp(firebaseConfig);

// 🔥 EXPORTAR
export const auth = getAuth(app);
export const db = getFirestore(app);