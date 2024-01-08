import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitBtn = document.querySelector("#submit");
const emailInput = document.querySelector("#email");
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    if (email == "") {
      Toast.error('Please enter your Email !')
    }
    else{
        sendPasswordResetEmail(auth, email)
      .then(() => {
        Toast.success('Password reset email sent.') 
      })
      .catch((error) => {
        const errorMessage = error.message;
        Toast.error(errorMessage);
      });
    }
  })