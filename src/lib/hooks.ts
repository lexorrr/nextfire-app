import {useAuthState} from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react'

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    console.log(user);
    

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        console.log(doc.data()?.username);
        
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    // clean up function
    return unsubscribe;

  }, [user]);

  return { user, username };
}