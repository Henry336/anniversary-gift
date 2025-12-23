// app/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAFR8kamGUDFqygpNn7QNq1n0rtAcyf1gg",
  authDomain: "anniversary-game-75787.firebaseapp.com",
  databaseURL: "https://anniversary-game-75787-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anniversary-game-75787",
  storageBucket: "anniversary-game-75787.firebasestorage.app",
  messagingSenderId: "669196472242",
  appId: "1:669196472242:web:38d52f0db55858f5fb5eab",
  measurementId: "G-68D6YWSG9G"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db };