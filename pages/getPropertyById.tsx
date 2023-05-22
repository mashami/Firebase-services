import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { helperFunction } from '../utils/helpers'
// interface Product {
//   id: string;
//   // other properties of the product
//   images: string[];
// }

interface Property {
  id?: string | undefined;
  title?: string;
  description?: string;
  availability?: boolean;
  price?: string;
  date?: string;
  address?: {
      province?: string;
      district?: string;
      sector?: string;
      cell?: string;
      village?: string;
      houseNumber?: string;
      streetNumber?: string;
  };
  contacts?: {
      email?: string;
      phoneNumber?: string;
  };
  createdBy?: string;

  perks?: {
      wifi?: boolean,
      access_to_town?: boolean,
      kitchen?: boolean,
      bathroom?: boolean,
      secured_environment?: boolean,
      recreational_centre?: boolean,
      cleaning_service?: boolean,
  },
  status?: string,
  images?: string[];
}


// Get a single product and its images
export const getProduct = async (id: string) => {

const idIm='kGnH9EseEiSKzdPdMQCR'


  const docRef = doc(db, "property", idIm);
  
  const docSnap = await getDoc(docRef);
  

  if (!docSnap.exists()) {
    console.log(`Product ${id} does not exist.`);
    return null;
  }

  const productData = docSnap.data();

  // const imagesRef = ref(storage, `images/${idIm}`);
  // const { items } = await listAll(imagesRef);

  const productImages: string[] = [];

  // for (const item of items) {
  //   const downloadURL = await getDownloadURL(item);
  //   productImages.push(downloadURL);
  // }

  const product: Property = { id: docSnap.id, ...productData };
  // const property: Property = { id: docSnap?.data?.id, ...propertyData};
  console.log(product)
  return product;
};

export default getProduct;
