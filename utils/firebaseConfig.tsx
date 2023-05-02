// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApp, initializeApp } from 'firebase/app'
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// import { getApp } from "firebase/app"


const config: FirebaseOptions = {
  apiKey: "AIzaSyAyTCjRHO_zXkhJPegPC2mniXKaGB4f7uo",
  authDomain: "hotelbooking-690d5.firebaseapp.com",
  projectId: "hotelbooking-690d5",
  storageBucket: "hotelbooking-690d5.appspot.com",
  messagingSenderId: "772422817290",
  appId: "1:772422817290:web:851b02727e2641420671f3",
  measurementId: "G-WTWSE100XL"
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

const app = createFirebaseApp(config)
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getStorage(app)
