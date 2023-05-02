// import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
// import { storage } from ".././utils/firebase"; // Replace with your Firebase config



// // Get all images in the storage
// async function getAllImages() {
//   const imagesRef = ref(storage, "/images/SaJRqz9dnXPzcLnAESjv"); // Replace "images/" with your storage path
//   const allImages = [];

  
//   const { items } = await listAll(imagesRef);

  
//   for (const item of items) {
//     const downloadURL = await getDownloadURL(item);
//     allImages.push(downloadURL);
//   }
//        console.log(allImages)
//   return allImages;
// }

// export default getAllImages;
// ============================================================================================


import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { collection, getDocs, orderBy, startAfter, limit, query } from "firebase/firestore";
import { db } from "../utils/firebase";

interface Product {
  id: string;
  // other properties of the product
  images: string[];
}

// Get all products and their images
export const getAllProducts = async () => {
  const colRef = collection(db, "Products");
  // const colRef = query(collection(db, "Products"), orderBy("createdBy"), limit(8));

  const querySnapshot = await getDocs(colRef);

  const products: Product[] = [];

  for (const doc of querySnapshot.docs) {
    const productData = doc.data();

    const imagesRef = ref(storage, `images/${doc.id}`);
    const { items } = await listAll(imagesRef);

    const productImages: string[] = [];

    for (const item of items) {
      const downloadURL = await getDownloadURL(item);
      productImages.push(downloadURL);
    }

    products.push({ id: doc.id, ...productData, images: productImages });
  }
    console.log(products)
  return products;
};

export default getAllProducts;
