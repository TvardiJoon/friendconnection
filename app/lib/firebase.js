
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1wpagTs8yySDoT7j36LefEUTSHJAzg9Y",
  authDomain: "friend-connection-c49a8.firebaseapp.com",
  projectId: "friend-connection-c49a8",
  storageBucket: "friend-connection-c49a8.appspot.com",
  messagingSenderId: "460215450844",
  appId: "1:460215450844:web:c8d9a93cbebb9d14120819",
  measurementId: "G-0PVMBZ864C"
};



const app = initializeApp(firebaseConfig);

// Get Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
