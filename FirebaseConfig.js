// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {  
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  initializeFirestore, 
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getDatabase, ref, update  } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Firebase config settings
const firebaseConfig = {
  
};

// Firebase App initialize
export const firebaseApp = initializeApp(firebaseConfig);

// Firebase Auth initialize
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore initialize
// export const firestoreDB = getFirestore(firebaseApp);
// Firestore initialize with unlimited cache size
export const firestoreDB = initializeFirestore(firebaseApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

export const firebaseRealDB = getDatabase(firebaseApp);












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

export const logoutUser = async () => {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    throw new Error(error.message);
  }
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
    const querySnapshot = await getDocs(
      collection(firestoreDB, collectionName)
    );
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(firestoreDB, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(firestoreDB, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(error.message);
  }
};