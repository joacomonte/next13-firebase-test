// LoadingImage.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import styles from "./loadingImg.module.css"

interface LoadingImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const LoadingImage: React.FC<LoadingImageProps> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
      {!loaded && <div>Loading...</div>}
      <Image 
        src={src} 
        alt={alt} 
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default LoadingImage;
