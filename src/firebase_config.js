// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_APIKEY,
//     authDomain: process.env.REACT_APP_AUTHDOMAIN,
//     projectId: process.env.REACT_APP_PROJECTID,
//     // storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//     // messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//     appId: process.env.REACT_APP_APPID,
//     // measurementId: process.env.REACT_APP_MEASUREMENTID
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const {REACT_APP_APIKEY, REACT_APP_AUTH,
       REACT_APP_PRJID, REACT_APP_APPID} = process.env;

const firebaseConfig = {
 apiKey: REACT_APP_APIKEY,
 authDomain: REACT_APP_AUTH,
 projectId: REACT_APP_PRJID,
 appId: REACT_APP_APPID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
