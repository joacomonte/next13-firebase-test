// LoadingImage.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import styles from "./loadingImg.module.css"

interface LoadingImageProps {
  src: string;
  alt: string;

}

const LoadingImage: React.FC<LoadingImageProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.imgContainer}>
      {/* {!loaded && <div>Loading...</div>} */}
      <Image 
        src={src} 
        alt={alt} 
        objectFit="contain"
        fill
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default LoadingImage;
