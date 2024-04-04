import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyAEE5mekvCS4K3u6eeDLQPuDWG212xEr6A',
    authDomain: 'mvc-eshop-test.firebaseapp.com',
    databaseURL: 'https://mvc-eshop-test-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'mvc-eshop-test',
    storageBucket: 'mvc-eshop-test.appspot.com',
    messagingSenderId: '711455833282',
    appId: '1:711455833282:web:8feae4ee892b16e6b10f5b'
  }

  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)
  connectFirestoreEmulator(db, '127.0.0.1', 8081)

  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')

  export {
    db,
    auth
  }