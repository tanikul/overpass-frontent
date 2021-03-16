importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

var firebaseConfig = {
    apiKey: "AIzaSyApvsqcGtSylU6OcOyO4dnerDz8zflqgkU",
    authDomain: "overpass-b5e6f.firebaseapp.com",
    projectId: "overpass-b5e6f",
    storageBucket: "overpass-b5e6f.appspot.com",
    messagingSenderId: "342066935344",
    appId: "1:342066935344:web:db7b2acc1ec56330bf5ff5",
    measurementId: "G-X574B1ED6M"
  };
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
     const promiseChain = clients
          .matchAll({
               type: "window",
               includeUncontrolled: true,
          })
          .then((windowClients) => {
               for (let i = 0; i < windowClients.length; i++) {
                    const windowClient = windowClients[i];
                    windowClient.postMessage(payload);
               }
          })
          .then(() => {
               return registration.showNotification("my notification title");
          });
     return promiseChain;
});
self.addEventListener("notificationclick", function(event) {
     console.log(event);
});