import axios from 'axios';
import { useState, useEffect } from "react";

export const ImageToBase64Converter = (imageUrl) => {
  const [base64Image, setBase64Image] = useState('');
  useEffect(() => {
    const getImageAsBase64 = async () => {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'blob',
        });
        const blob = response.data;

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setBase64Image(base64String);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image or converting to base64:', error);
      }
    };

    getImageAsBase64();
  }, [imageUrl]);

  return base64Image;
};

export const ImageToBase64Converter2 = (imageUrl) => {
  const [base64Image, setBase64Image] = useState('');
  useEffect(() => {
     const getImageAsBase64  = (imgUrl) => {
      const image = new Image();
      image.crossOrigin='anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        ctx.drawImage(image, 0, 0);
        const dataUrl = canvas.toDataURL();
        setBase64Image(dataUrl)
      }
      image.src = imgUrl;
    }
    getImageAsBase64(imageUrl)
  }, [imageUrl])
  return base64Image
}

