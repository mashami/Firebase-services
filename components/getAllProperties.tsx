// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../utils/firebase";
// import React, { useState, useEffect } from 'react';
// import { Box, Image, Text, VStack } from '@chakra-ui/react';
// import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';
// import { ref, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '.././utils/firebase';

// export const getAllProducts = async () => {
//   const colRef = collection(db, "Products");
//   const querySnapshot = await getDocs(colRef);

//   const products: { id: string; }[] = [];
//   querySnapshot.forEach((doc) => {
//     products.push({ id: doc.id, ...doc.data() });
//   });
//   console.log(products);
//   return products
// };

// // call the function to get all products
//  getAllProducts();
// ==================================================================================

// import { storage } from "../utils/firebase";
// import { ref,getDownloadURL } from "firebase/storage";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../utils/firebase";

// export const getAllProducts = async () => {
//   const colRef = collection(db, "Products");
//   const querySnapshot = await getDocs(colRef);
//   interface Product {
//     id: string;
//     // other properties of the product
//     images: string[];
//   }


//   const products: Product[] = [];

//   querySnapshot.forEach(async (doc) => {
//     const productData = doc.data();
    
//     const productImages: string[] = [];
//     console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

//     if (Array.isArray(productData.imageIds)) {

//       for (const imageId of productData.imageIds) {
//         // for (const imageId of doc.id) {
//         const imageRef = ref(storage, `images/${doc.id}/`);
//         // const imageRef = ref(storage, `images/9HMCaBBQw7lluWIOI0Ov/${imageId}`);
        
       
//         const downloadURL = await getDownloadURL(imageRef);
//         console.log("==================================" + downloadURL)
//         productImages.push(downloadURL);
//       }
      
//     }
//     products.push({ id: doc.id, ...productData, images: productImages });
    
    
//   });
//   console.log(products);
//   return products;
// };

// export default getAllProducts;

// =================================================================================


// ======================================================================================

// import { collection, getDocs } from "firebase/firestore";
// import { ref, getDownloadURL } from "firebase/storage";
// import { db, storage } from ".././utils/firebase";

// async function getAllDocumentsWithImages() {
//   const productsCollectionRef = collection(db, "Products");
//   const querySnapshot = await getDocs(productsCollectionRef);
//   const products = [];

//   for (const doc of querySnapshot.docs) {
//     const productData = doc.data();

//     if (productData.images) {
//       const images = [];
//       for (const imageName of productData.images) {
//         const imageRef = ref(storage, `images/${doc.id}/${imageName}`);
//         const downloadURL = await getDownloadURL(imageRef);
//         images.push(downloadURL);
//         console.log("=====================================================")
//         console.log(downloadURL)
//         console.log("==========================================================")
//       }
//       productData.images = images;
//     }
    

//     products.push({
//       id: doc.id,
//       ...productData,
//     });
//   }

//   return products;
// }

// export default async function getProducts() {
//   const productsWithImages = await getAllDocumentsWithImages();
//   console.log(productsWithImages)
//   return productsWithImages;
// }
// =====================================================================================


import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

interface Product {
  id: string;
  // other properties of the product
  images: string[];
}

// Get all products and their images
export const getAllProducts = async () => {
  const colRef = collection(db, "Products");
  const querySnapshot = await getDocs(colRef);

  const products: Product[] = [];

  for (const doc of querySnapshot.docs) {
    const productData = doc.data();

    const productImages: string[] = [];

    if (Array.isArray(productData.imageIds)) {
      const imagesRef = ref(storage, `images/${doc.id}/`);
      const { items } = await listAll(imagesRef);

      for (const item of items) {
        const downloadURL = await getDownloadURL(item);
        productImages.push(downloadURL);
      }
    }

    products.push({ id: doc.id, ...productData, images: productImages });
  }
   console.log(products)
  return products;
};

export default getAllProducts;

