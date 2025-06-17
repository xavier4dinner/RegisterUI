import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get, remove } from "firebase/database";

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

//Register Start
//OTP Save
export function OTPsave(email, firstName, lastName, username, password, role, otp, expire) {
  const db = getDatabase(app, dbUrl);
  const newUserOTPRef = ref(db, `OTPVerification/${encodeURIComponent(email)}`);
  return set(newUserOTPRef, {
    Email: email,
    FirstName: firstName,
    LastName: lastName,
    Username: username,
    Password: password,
    Role: role,
    OTP: otp,
    Expire: expire
  })
}

export async function getOTP(email) {
  const db = getDatabase(app, dbUrl);
  const otpRef = ref(db, `OTPVerification/${encodeURIComponent(email)}`);
  const snapshot = await get(otpRef);
  return snapshot.exists() ? snapshot.val() : null;
}

export async function deleteOTP(email) {
  const db = getDatabase(app, dbUrl);
  const otpRef = ref(db, `OTPVerification/${encodeURIComponent(email)}`);
  return remove(otpRef)
}


export function fullUserInformation(user) {
  const db = getDatabase(app, dbUrl);
  const addInfoRef = push(ref(db, 'ApprovalofAccounts'))
  return set(addInfoRef, user);
}

export async function usernameChecker(username) {
  const db = getDatabase(app, dbUrl);
  const roles = ['ContentCreator', 'MarketingLead', 'GraphicDesigner'];
  for (const role of roles) {
    const nodeRef = ref(db, role);
    const snapshot = await get(nodeRef);
    if (snapshot.exists()){
      const user = snapshot.val();
      if(Object.values(user).some(user => user.Username && user.Username.toLowerCase() === username.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}
//Register End

//Login Start
