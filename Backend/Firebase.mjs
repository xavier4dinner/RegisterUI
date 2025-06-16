import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAdCkNDNjnrusXg6blO7z02EkhCiezpvdY",
  authDomain: "ai-powered-digital-marke-fc7af.firebaseapp.com",
  projectId: "ai-powered-digital-marke-fc7af",
  storageBucket: "ai-powered-digital-marke-fc7af.appspot.com",
  messagingSenderId: "552564748664",
  appId: "1:552564748664:web:94c3eb9a66f8e76fc6188d",
  measurementId: "G-M9V60YDLGY"
};

const app = initializeApp(firebaseConfig);
const dbUrl = "https://ai-powered-digital-marke-fc7af-default-rtdb.asia-southeast1.firebasedatabase.app";


//Register
export function OTPData(email, firstName, lastName, password, role) {
  const db = getDatabase(app, dbUrl);
  const newUserRef = push(ref(db, 'OTP Verification'));
  return set(newUserRef, {
    Email: email,
    FirstName: firstName,
    LastName: lastName,
    Password: password,
    Role: role
  })
}


export function fullUserInformation(contactNumber, city,state, country, zipCode) {
  const db = getDatabase(app,dbUrl);
  const addInfoRef = push(ref(db, 'Approval of Accounts'))
  return set(addInfoRef, {
    ContactNumber : contactNumber,
    City: city,
    State: state,
    Country: country,
    ZipCode: zipCode
  })
}

