import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebase_config = {
	projectId: 'drafting-canvas',
	storageBucket: 'drafting-canvas.appspot.com',
	authDomain: 'drafting-canvas.firebaseapp.com',
	databaseURL: 'https://drafting-canvas-default-rtdb.firebaseio.com',
	messagingSenderId: '851092224450',
	appId: '1:851092224450:web:29a452c574f17cdfe07e5b',
	apiKey: process.env.FIREBASE_API_KEY,
};

// Initialize Firebase
const app = initializeApp(firebase_config);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
