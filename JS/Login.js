import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitBtn = document.querySelector("#submit");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");
const forgot = document.querySelector("#forgot");

togglePassword.addEventListener("click", function () {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("bi-eye");
});

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  if (email == "") {
    Toast.error('Please enter your Email !')
  }
  else if (password == "") {
    Toast.error('Please enter your Password !')
  }
  else{
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User created successfully
      Toast.success('Login Successfully')
      // console.log('User created:', userCredential.user);
      window.location.href = '../Profile.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      Toast.error(errorMessage);
    });
  }
})
forgot.addEventListener('click', () =>{
  window.location.href= '../verify/forgotPassword.html'
})

// Check User Signed in

function checkAuthAndRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = '../Profile.html';
    }
  });
}

checkAuthAndRedirect();