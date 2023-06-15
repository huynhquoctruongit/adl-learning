import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC34YUL_ohlbKfBGV1_sHhBxssBKQWz-HM',
  authDomain: 'ican-adaptive-learning.firebaseapp.com',
  projectId: 'ican-adaptive-learning',
  storageBucket: 'ican-adaptive-learning.appspot.com',
  messagingSenderId: '59170763125',
  appId: '1:59170763125:web:9cd43888a6947c4075e33c',
  measurementId: 'G-J5D915G10M'
};

let appFirebase = null;
// let analytics = null

if (typeof window !== 'undefined') {
  appFirebase = initializeApp(firebaseConfig);
}

export const analytics = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(appFirebase);
    
  } else {
    return null;
  }
};
