import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onChildAdded,
  get,
  child,
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const dataStore = {
  logs: [],
  listenersInitialized: false,
  onUpdateCallbacks: [],
};

async function initDataStore() {
  if (dataStore.listenersInitialized) return;

  const logsRef = ref(db, "logs");

  try {
    const snapshot = await get(child(ref(db), "logs"));
    if (snapshot.exists()) {
      snapshot.forEach(childSnap => {
        dataStore.logs.push({ id: childSnap.key, ...childSnap.val() });
      });
    }
  } catch (error) {
    console.error("Failed to load initial logs:", error);
  }

  onChildAdded(logsRef, (newData) => {
    const newEntry = { id: newData.key, ...newData.val() };
    dataStore.logs.push(newEntry);
    dataStore.onUpdateCallbacks.forEach(fn => fn(newEntry));
  });

  dataStore.listenersInitialized = true;
}

function getLogs() {
  return dataStore.logs;
}

function onNewLog(callback) {
  dataStore.onUpdateCallbacks.push(callback);
}

initDataStore();

export { getLogs, onNewLog };