// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1C9J2lnIdWyhcrOGFTn0enQmqN13Rms0",
  authDomain: "badminton-booking-system-api.firebaseapp.com",
  projectId: "badminton-booking-system-api",
  storageBucket: "badminton-booking-system-api.firebasestorage.app",
  messagingSenderId: "254455515689",
  appId: "1:254455515689:web:3be121b660e4ba103a2a38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// LINE 登入供應商
const lineProvider = new OAuthProvider('oidc.line');

// 添加基本範圍
lineProvider.addScope('profile');
lineProvider.addScope('openid');
lineProvider.addScope('email');

// 設定自訂參數 - 不指定 redirect_uri
lineProvider.setCustomParameters({
  prompt: 'consent'
  // 不要設定 response_type，讓 Firebase 自動處理
});

export { db, auth, lineProvider, signInWithPopup, signInWithRedirect, getRedirectResult };
