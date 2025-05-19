// src/firebase/firestoreUtils.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const entriesRef = collection(db, "entries");

// Add a new entry to Firestore
export const addEntry = async (dump_text, summary, next_step) => {
  try {
    await addDoc(entriesRef, {
      dump_text,
      summary,
      next_step,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding entry:", error);
  }
};

// Get the 10 most recent entries
export const getLatestEntries = async () => {
  try {
    const q = query(entriesRef, orderBy("timestamp", "desc"), limit(10));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
};
