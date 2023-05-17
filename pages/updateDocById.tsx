import { db } from "../utils/firebase";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";


// ============================================================================
// const updateProduct = async (id: string, updatedData: object) => {
//   const productRef = doc(db, "Products", id);
//  const updatedDoc = await updateDoc(productRef, updatedData);
//   console.log(`Product with id ${id} updated successfully.`);
//   return updatedDoc
// };

// export default updateProduct;

// ================================= Using onSnapshot fuction ==========================================

const updateProduct = async (id: string, updatedData: object) => {
    const productRef = doc(db, "Products", id);
  
    // Listen for changes in the product document
    //onSnapshot what is does 
    const unsubscribe = onSnapshot(productRef, (doc) => {
      console.log("Product data changed:", doc.data());
    });
    // Update the product document with the new data
    const propertySnap = await getDoc(productRef);
    if (!propertySnap.exists()) {
        return console.log(`Property with ID: "${propertySnap.id}" not found`);
    }
    await updateDoc(productRef, updatedData);
  
    console.log(`Product with id: "${propertySnap.id}"updated successfully.`);
    unsubscribe(); // Stop listening for changes
  };
  export default updateProduct;
