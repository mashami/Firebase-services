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

import { helperFunction } from '../utils/helpers'
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { collection, getDocs, orderBy, startAfter, limit, query , where} from "firebase/firestore";
import { db } from "../utils/firebase";


// interface Product {
//   id: string;
//   // other properties of the product
//   images: string[];
// }
interface Property {
    id?: string | undefined;
    title: string;
    description: string;
    availability: boolean;
    price: string;
    date: string;
    address: {
        province: string;
        district: string;
        sector: string;
        cell: string;
        village: string;
        houseNumber: string;
        streetNumber: string;
    };
    contacts: {
        email: string;
        phoneNumber: string;
    };
    createdBy: string;

    perks: {
        wifi: boolean,
        access_to_town: boolean,
        kitchen: boolean,
        bathroom: boolean,
        secured_environment: boolean,
        recreational_centre: boolean,
        cleaning_service: boolean,
    },
    status: string,
    images: string[];
}


// Get all properties and their images
export const getAllProducts = async () => {
    try {
        // With orderByField and limitValue
        const whereConditions = [where("availability", "==", true), where("status", "==", 'active')];
        const querySnapshot = await helperFunction.executeQuery("property", whereConditions, "date", 8);
        const property: Property[] = [];

        for (const doc of querySnapshot.docs) {
           
            const PropertyData: Property = doc.data() as Property;


            property.push({ ...PropertyData, id: doc.id });

        }
        console.log(property);
        
        return {

            data: property,

            status: 200,
            success: true
        }
    } catch (error: any) {
        if (error) {
            return {
                error: true,
                errorCode: error?.code,
                errorMessage: error?.message
            }
        }

    }
};

export default getAllProducts;
