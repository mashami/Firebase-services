import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

interface Product {
  id: string;
  // other properties of the product
  images: string[];
}

// Get a single product and its images
export const getProduct = async (id: string) => {

const idIm='asl2kEKNpByPr3ZOpJWh'


  const docRef = doc(db, "Products", idIm);
  
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log(`Product ${id} does not exist.`);
    return null;
  }

  const productData = docSnap.data();

  const imagesRef = ref(storage, `images/${idIm}`);
  const { items } = await listAll(imagesRef);

  const productImages: string[] = [];

  for (const item of items) {
    const downloadURL = await getDownloadURL(item);
    productImages.push(downloadURL);
  }

  const product: Product = { id: docSnap.id, ...productData, images: productImages };
  console.log(product)
  return product;
};

export default getProduct;
