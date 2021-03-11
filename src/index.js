import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "core-js";
import "./polyfill";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorker from "./serviceWorker";
import { icons } from "./assets/icons";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { subscription } from "src/services/CommonService";

React.icons = icons;

// Check if service workers are supported
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`, {

  });
}*/
/*serviceWorker.register('/service-worker.js',{scope:'/'});


const publicVapidKey = 'BBSCkqm2M3p7vbebMGzpNzU0Jp91ihWef6oes4zp8fC0Zyhe1YGrq8YHajdXzFUGvpFCQJnZBECOIx-4agHrqII';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getSubscribedElement = () => document.getElementById('subscribed');
const getUnsubscribedElement = () => document.getElementById('unsubscribed');

const setSubscribeMessage = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  getSubscribedElement().setAttribute('style', `display: ${subscription ? 'block' : 'none'};`);
  getUnsubscribedElement().setAttribute('style', `display: ${subscription ? 'none' : 'block'};`);
};

window.subscribe = async () => {
  
  if (!('serviceWorker' in navigator)) return;
  
  const registration = await navigator.serviceWorker.ready;
  console.log('registration');
  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  
  const accessToken = "";
  subscription(accessToken).then(({ status, data }) => {
    return status === 200 ? setSubscribeMessage() : [];
  });
};

window.unsubscribe = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const { endpoint } = subscription;
  const response = await fetch(`/subscription?endpoint=${endpoint}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });

  if (response.ok) {
    await subscription.unsubscribe();
    setSubscribeMessage();
  }
};

window.broadcast = async () => {
  await fetch('/broadcast', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
};

setSubscribeMessage();
window.subscribe();
*/
 {/*<React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
   </React.StrictMode>*/}
ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
