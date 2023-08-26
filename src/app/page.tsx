/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "./page.module.css";

// React Related ------------
import { useState } from "react";

// Firebase related ---------
import { db, app } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

// Helpers related ---------
import { UploadManager } from "./helpers/uploadManager";
import LoadingImage from "./components/LoadingImg";

type LoadingStatus = {
  [key: string]: boolean;
};

export default function Home() {
  const [uploadManager, setUploadManager] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [percent, setPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [imgUrlsList, setImgUrlsList] = useState<string[]>([]);

  const handleLoadImgs = async () => {
    const storage = getStorage(app);
    const imagesRef = ref(storage, "images");
    try {
      const res = await listAll(imagesRef);
      const urlPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
      const urls = await Promise.all(urlPromises);
      setImgUrlsList(urls);
    } catch (error) {
      console.error("Error listing images:", error);
    }
  };

  const handleAddString = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  const handleUploadToFirebase = () => {
    if (file) {
      setIsUploading(true); // Set isUploading to true when starting the upload

      const manager = UploadManager(file, app);
      setUploadManager(manager);

      manager.startUpload(
        (snapshot: any) => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(progressPercent);
        },
        (error: FirebaseError) => {
          console.error("Error uploading file:", error);
          setIsUploading(false); // Set isUploading to false on error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(manager.task.snapshot.ref);
            console.log("File uploaded:", downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
          setIsUploading(false); // Set isUploading to false on completion
          setFile(null);
          setPercent(0);
        }
      );
    }
  };

  const togglePauseResumeUpload = () => {
    if (uploadManager) {
      if (uploadManager.isPaused()) {
        uploadManager.resumeUpload();
        setIsPaused(false);
      } else {
        uploadManager.pauseUpload();
        setIsPaused(true);
      }
    }
  };

  const cancelUpload = () => {
    if (uploadManager) {
      uploadManager.cancelUpload();
    }
    setIsPaused(false);
    setFile(null);
    setPercent(0);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Firebase Services Tests</h1>

      <form
        className={styles.card}
        style={{ width: "100%" }}
        onSubmit={handleAddString}
      >
        <h2>Test to save string into Firebase DB</h2>
        <input
          type="text"
          className={styles.darkInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. Testing phrase"
        />
        <button className={styles.darkButton} type="submit">
          Save
        </button>
      </form>

      <section className={styles.card} style={{ width: "100%" }}>
        <h2>Upload any image to Firebase Storage</h2>
        {!file ? (
          <>
            <div>
              <label htmlFor="fileUpload" className={styles.darkButton}>
                Select an image
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileSelection}
                hidden
              />
            </div>
          </>
        ) : (
          <>
            <button
              className={styles.darkButton}
              style={{ backgroundColor: "rgba(0, 100, 0, 0.5)" }}
              onClick={handleUploadToFirebase}
              aria-label="Upload image to Firebase"
            >
              {`Confirm upload "${file.name}"`}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                className={styles.darkButton}
                style={{ backgroundColor: "rgba(139, 0, 0, 0.5)" }}
                onClick={cancelUpload}
              >
                Cancel
              </button>

              {isUploading && (
                <button
                  style={{ marginRight: "10px" }}
                  className={styles.darkButton}
                  onClick={togglePauseResumeUpload}
                  aria-label={isPaused ? "Resume upload" : "Pause upload"}
                >
                  {isPaused ? "Resume" : "Pause"} Upload
                </button>
              )}
            </div>
          </>
        )}

        {percent !== 0 && <p className={styles.code}>{percent} % done</p>}
      </section>

      <section className={styles.card} style={{ width: "100%" }}>
        <h2>Uploaded Images</h2>

        <button className={styles.darkButton} onClick={handleLoadImgs}>
          Load images
        </button>

        <div>
          {imgUrlsList.map((url, idx) => (
            <LoadingImage
              key={idx}
              src={url}
              alt={`Image ${idx}`}
              width={300}
              height={300}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
