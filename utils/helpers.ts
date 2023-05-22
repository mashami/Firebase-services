 
 import { db, storage } from "./firebase"
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { QueryConstraint } from "firebase/firestore";
import {
    collection,
    addDoc,
    getDoc,
    setDoc,
    doc,
    Timestamp, getDocs, orderBy, startAfter, query, where, limit

} from "firebase/firestore"
 


export const helperFunction ={
   getDocFromCollection : async (collectionName:string,docId:string) =>{
   
const collectionRef= collection(db, collectionName);
const docRef = doc(collectionRef, docId)


try{
    const documentSnapshot = await getDoc(docRef)
     console.log(documentSnapshot.id);
     
    return {
        success:true,
        // data: { data:documentSnapshot.data(), id:documentSnapshot.id }
        data: { ...documentSnapshot.data(), id: documentSnapshot.id }

    }

}catch(error:any){
    if (error) {
        return {
            error: true,
            errorCode: error?.code,
            errorMessage: error?.message
        }
    }


}

},

getImages: async(docId:string) => {

    const imagesRef = ref(storage, `images/${docId}`);
    const { items } = await listAll(imagesRef);

    const productImages: string[] = [];

    for (const item of items) {
        const downloadURL = await getDownloadURL(item);
        productImages.push(downloadURL);
    }

    return (productImages)
},


async executeQuery(
    collectionPath: string,
    whereConditions: QueryConstraint[],
    orderByField?: string,
    limitValue?: number
  ) {
    const colRef = collection(db, collectionPath);
    let queries=null
    if (orderByField) {
        queries = query(colRef, orderBy(orderByField));
    }

    queries = query(colRef, ...whereConditions);

    if (limitValue) {
        queries = query(colRef, limit(limitValue));
    }

    const querySnapshot = await getDocs(colRef);
    return querySnapshot;
  }


}