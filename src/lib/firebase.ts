import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDEFNWgPMDf9Re01hT4h3yNCcZ1iD1kYfo",
  authDomain: "nextfire-84857.firebaseapp.com",
  projectId: "nextfire-84857",
  storageBucket: "nextfire-84857.appspot.com",
  messagingSenderId: "441409250083",
  appId: "1:441409250083:web:f8e062716712d1f8c26296",
  measurementId: "G-WSFQGH98S2",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: firebase.firestore.DocumentSnapshot) {
  const data = doc.data();
  
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data ? data.createdAt.toMillis() : 0,
    updatedAt: data ? data.updatedAt.toMillis() : 0,
  };
}
