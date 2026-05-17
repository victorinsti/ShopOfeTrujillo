importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBDAOW-qrvxTcJVM4QNWPQvrmbz8wcAQLM",
  authDomain: "trujillo-digital-hub.firebaseapp.com",
  projectId: "trujillo-digital-hub",
  storageBucket: "trujillo-digital-hub.firebasestorage.app",
  messagingSenderId: "162799375782",
  appId: "1:162799375782:web:2be9127bfeaa613fd6ab67"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body
        }
    );

});