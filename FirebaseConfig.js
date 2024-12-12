// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    onAuthStateChanged 
} from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Firebase config settings
const firebaseConfig = {
    apiKey: "AIzaSyCDD4kKOdRXMfG5CDxvCOPgnFMSe3LaVE0",
    authDomain: "spotable-9d53c.firebaseapp.com",
    projectId: "spotable-9d53c",
    storageBucket: "spotable-9d53c.firebasestorage.app",
    messagingSenderId: "84993728511",
    appId: "1:84993728511:web:0342a4ae3a0c5b8677d1ca",
    measurementId: "G-RBXLDM6RSY"
  };

// Firebase App initialize
export const firebaseApp = initializeApp(firebaseConfig);

// Firebase Auth initialize
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore initialize
export const firestoreDB = getFirestore(firebaseApp);

export const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const observeAuthState = (callback) => {
    return onAuthStateChanged(firebaseAuth, callback);
  };

  export const addDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(firestoreDB, collectionName), data);
      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const fetchDocuments = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      throw new Error(error.message);
    }
  };
