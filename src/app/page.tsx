'use client'

import styles from './page.module.css'
import { initializeApp } from "firebase/app";
import { useState } from "react"; // Import useState
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyB8XbIQfHMBZqwAtk2OIRHVY9j4Qo3EFMc",
  authDomain: "next13-portfolio.firebaseapp.com",
  projectId: "next13-portfolio",
  storageBucket: "next13-portfolio.appspot.com",
  messagingSenderId: "77450168588",
  appId: "1:77450168588:web:2b96ee9f4ec72642a06129"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // State to hold user input

  async function createCollectionAndAddDocument() {
    const collectionRef = collection(db, "yourCollectionName");
  
    const collectionSnapshot = await getDocs(collectionRef);
  
    if (collectionSnapshot.size === 0) {
      await addDoc(collectionRef, { yourField: inputValue });
      console.log("Collection and document created.");
    } else {
      console.log("Collection already exists");
    }
  }
  

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Description</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
        />
        <button onClick={createCollectionAndAddDocument}>Create Collection and Document</button>
      </div>
    </main>
  );
}
