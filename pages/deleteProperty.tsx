import { db } from "../utils/firebase";
import { doc, deleteDoc,getDoc } from "firebase/firestore";

const deleteProduct = async (id: string) => {
  const productRef = doc(db, "Products", "f6DjqmxoAnzfG0PeXgiK");
  const propertySnap = await getDoc(productRef);
  if (!propertySnap.exists()) {
    return console.log(`Property with ID: "${propertySnap.id}" not found`);
}
  await deleteDoc(productRef);
return  console.log(`Product with id: "${propertySnap.id}" deleted successfully.`);
};

export default deleteProduct;
