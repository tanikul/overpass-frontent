import firebase from "firebase/app";
import "firebase/messaging";

let messaging = null
if (firebase.messaging.isSupported()) {
    const initializedFirebaseApp = firebase.initializeApp({
        // Project Settings => Add Firebase to your web app
        
       apiKey: "AIzaSyApvsqcGtSylU6OcOyO4dnerDz8zflqgkU",
       authDomain: "overpass-b5e6f.firebaseapp.com",
       projectId: "overpass-b5e6f",
       storageBucket: "overpass-b5e6f.appspot.com",
       messagingSenderId: "342066935344",
       appId: "1:342066935344:web:db7b2acc1ec56330bf5ff5",
       measurementId: "G-X574B1ED6M"
   });
   messaging = initializedFirebaseApp.messaging();
}


const subscribeTokenToTopic = (token, topic) => {
    const fcm_server_key = "AAAAT6THNjA:APA91bEpVPiz1LpQUG0pY73PKowO8UyPCeVaV3aFusud1zMGUoeevW4BP-rwoGPqA2R72geNPWyBz7fqnkcr214OxXZovTB0gK937kEK66vJlgDejCp7J0iLAhVnWJuPgmwnnHXpvIWo";
    fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key='+fcm_server_key
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
      console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }
export { messaging, subscribeTokenToTopic };
