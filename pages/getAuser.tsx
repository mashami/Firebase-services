
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { helperFunction } from '../utils/helpers'
// import admin from 'firebase-admin'
import { ref, uploadBytesResumable, getDownloadURL, listAll, getStorage } from 'firebase/storage'
console.log("=============================================");


interface Product {
    id: string | undefined;
    // other properties of the product
    images: string[];
}



export const getUserDoc = async (docId: string) => {
    docId = '92qvutlAT0l2ywDueVzJ'


    const docSnap = await helperFunction.getDocFromCollection('Products', docId)
    const productData = docSnap?.data;

    const productImages= await helperFunction.getImages(docId)

    const product: Product = { id: docSnap?.data?.id, ...productData, images: productImages };
    console.log(product)

    return (product)
}
export default getUserDoc;

