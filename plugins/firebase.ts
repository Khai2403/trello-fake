import { initializeApp } from "firebase/app";


export default defineNuxtPlugin( (nuxtApp) => {

  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: "trello-f54e0.firebaseapp.com",
    projectId: "trello-f54e0",
    storageBucket: "trello-f54e0.appspot.com",
    messagingSenderId: "122980491227",
    appId: "1:122980491227:web:70509b51335314958051fe",
    measurementId: "G-37GVBNTKK6",
  };
  
  const app = initializeApp(firebaseConfig);  
})
