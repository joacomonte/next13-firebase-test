import {initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB8XbIQfHMBZqwAtk2OIRHVY9j4Qo3EFMc",
    authDomain: "next13-portfolio.firebaseapp.com",
    projectId: "next13-portfolio",
    storageBucket: "next13-portfolio.appspot.com",
    messagingSenderId: "77450168588",
    appId: "1:77450168588:web:2b96ee9f4ec72642a06129",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { app, db };