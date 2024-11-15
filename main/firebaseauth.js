// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5r6Wf9P8bakibkyUpFLBOeb5URSZIDx4",
  authDomain: "pandelhopping-5ff5d.firebaseapp.com",
  projectId: "pandelhopping-5ff5d",
  storageBucket: "pandelhopping-5ff5d.appspot.com",
  messagingSenderId: "37009757490",
  appId: "1:37009757490:web:42f78b7450e14579ad332b",
  measurementId: "G-04SCBP2M6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function showMessage(message, divId) {
   var messageDiv = document.getElementById(divId);
   if (messageDiv) { // Check if the element exists
       messageDiv.classList.remove('hidden');
       messageDiv.classList.add('block');
       messageDiv.innerHTML = message;
       messageDiv.classList.remove('opacity-0');
       messageDiv.classList.add('opacity-100', 'transition-opacity', 'duration-1000');
       setTimeout(() => {
           messageDiv.classList.remove('opacity-100');
           messageDiv.classList.add('opacity-0', 'transition-opacity', 'duration-2000');
       }, 5000);
   } else {
       console.error(`Element with ID ${divId} not found.`);
   }
}


//signup portion
const signUpBtn = document.getElementById("sign_upbtn");
signUpBtn.addEventListener('click', (event) => {
   event.preventDefault();
   const name = document.getElementById("Name").value;
   const email = document.getElementById("signupemail").value;
   const number = document.getElementById("Mobilenumber").value;
   const password = document.getElementById("signuppassword").value;

   const auth = getAuth();
   const db = getFirestore();

   createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
       const user = userCredential.user;
       const userData = {
           email: email,
           name: name,
           number: number,
           password: password 
       };
       showMessage('Account created successfully.', 'signupmessage');
       const docRef = doc(db, "users", user.uid);
       setDoc(docRef, userData)
       .then(() => {
           setTimeout(() => {
               window.location.href = 'index.html';
           }, 2000);
       })
       .catch((error) => {
           console.error("Error writting document",error);
       });
   })
   .catch((error) => {
       const errorCode =error.code;
       if (errorCode == 'auth/email-already-in-use') {
           showMessage('Email Address already in Exists !!!!','signupmessage');
       }
       else{
           showMessage('Unable to create user', 'signupmessage');
       }
   });
});


//singin portion
const signIn = document.getElementById("signinbtn");
const OTP = document.getElementById("sendotp");
signIn.addEventListener('click', (event) => {
   event.preventDefault();
   const email = document.getElementById("loginemail").value;
   const password = document.getElementById("loginpassword").value;
   const auth = getAuth();
   signInWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
       showMessage('Login is successful', 'loginmessage');
       const user = userCredential.user;
       localStorage.setItem('loggedInuserId', user.uid);
       OTP.classList.remove('hidden');
   })
   .catch((error) => {
       const errorCode = error.code;
       if (errorCode === 'auth/invalid-credential') {
           showMessage('Incorrect Email or Password.', 'loginmessage');
       } else {
           console.error('error found')
           showMessage('Account does not exists.', 'loginmessage');
       }
   });
});


 