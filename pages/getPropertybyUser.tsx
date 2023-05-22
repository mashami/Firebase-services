import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../utils/firebase";
import { helperFunction } from "@/utils/helpers";

interface Product {
  id: string;

  images: string[];
}

// Get all products and their images by one User
export const getAllProductsByuser = async (userId: string) => {

  // const q = query(collection(db, "Products"), where("createdBy", "==",'2' ));
  userId = 'mxzTR9S5qGMlkWWtaKqbfeEotDb2'
  // const q = query(collection(db, "property"), where("createdBy", "==", userId));
  // const querySnapshot = await getDocs(q);
  const whereConditions = [where("createdBy", "==", userId)];
const querySnapshot = await helperFunction.executeQuery("property", whereConditions);
  

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

export default getAllProductsByuser;