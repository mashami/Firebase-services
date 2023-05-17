import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from ".././utils/firebase";

export const addProduct = async (
  formInput,
  imageFiles,
  setDownloadURLs,
  setIsUploading,
  setProgressUpload
) => {
  setIsUploading(true);
  setProgressUpload(0);

  try {
    const colRef = collection(db, "Products");
    const docRef = await addDoc(colRef, formInput);

    if (imageFiles.length > 0) {
      const promises = imageFiles.map((file) => {
        const imageRef = ref(storage, `images/${docRef.id}/${file.name}`);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
        });

        return new Promise((resolve, reject) => {
          uploadTask
            .then(async (snapshot) => {
              const downloadURL = await getDownloadURL(snapshot.ref);
              resolve(downloadURL);
            })
            .catch(reject);
        });
      });

      Promise.all(promises)
        .then((downloadURLs) => {
          setDownloadURLs(downloadURLs);
          setIsUploading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsUploading(false);
        });
    } else {
      setIsUploading(false);
    }
  } catch (error) {
    console.error(error);
    setIsUploading(false);
  }
};
