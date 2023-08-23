'use client'

import styles from './page.module.css'
import { FirebaseError, initializeApp } from "firebase/app";
import { useEffect, useState } from "react"; // Import useState
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { UploadTask, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage';

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
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage(app);
      const imagesRef = ref(storage, 'images');

      try {
        const res = await listAll(imagesRef);
        const urlPromises = res.items.map(itemRef => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error listing images:", error);
      }
    };

    fetchImages();
  }, []); 

  const handleAddString = async () => {
    const collectionRef = collection(db, "yourCollectionName");
    const collectionSnapshot = await getDocs(collectionRef);

    if (collectionSnapshot.size === 0) {
      await addDoc(collectionRef, { yourField: inputValue });
      console.log("Collection and document created.");
    } else {
      console.log("Collection already exists");
    }
  };

  const handleFileSelection = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadToFirebase = async () => {
    if (file) {
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

      setUploadTask(uploadTask); // Save uploadTask in state

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(progressPercent);
        },
        (error: FirebaseError) => {
          console.error("Error uploading file:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File uploaded:", downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }
      );
    }
  };

  const handlePauseUpload = () => {
    if (uploadTask) {
      uploadTask.pause();
      setIsPaused(true); // Update pause status
    }
  };

  return (
    <main className={styles.main}>
      
      <div className={styles.description}>
        <div className={styles.card}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a value"
          />
          <button onClick={handleAddString}>Save string into db</button>
        </div>
        
        <div className={styles.card}>
          <input type="file" accept="image/*" onChange={handleFileSelection} />
          <button onClick={handleUploadToFirebase}>Upload to Firebase</button>
          <button onClick={handlePauseUpload}>
            {isPaused ? "Resume" : "Pause"} Upload
          </button>
        </div>
  
        <p className={styles.code}>{percent} % done</p>
      </div>
      
      <div className={styles.card}>
        <h2>Uploaded Images</h2>
        <div className={styles.grid}>
          {imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt="Uploaded" width={100} height={100} />
            </div>
          ))}
        </div>
      </div>
  
    </main>
  );
}

