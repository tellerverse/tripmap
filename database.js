import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY8mioRQUDVQe2zBXjTljcfOYjmcKXTGc",
  authDomain: "trip-map-05.firebaseapp.com",
  databaseURL: "https://trip-map-05-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trip-map-05",
  storageBucket: "trip-map-05.firebasestorage.app",
  messagingSenderId: "246897924666",
  appId: "1:246897924666:web:01107e2aa676283b71b303",
  measurementId: "G-7RX6W2WJM8"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);