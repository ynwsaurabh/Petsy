import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from'./Toast.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const togglePassword = document.querySelector("#togglePassword");
const submitBtn = document.querySelector("#submit");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("bi-eye");
  });

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const phone = phoneInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    if(phone.length == 0 || phone.length < 10){
        Toast.error("Enter a Valid Phone Number")
    }
    else if(email.length <= 0){
        Toast.error("Enter a valid Email");
    }
    else if(password.length < 8){
        Toast.error("Password must be 8 character long")
    }
    else{
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            Toast.success("User Created Successfully")
            set(ref(db,'UserAuthList/' + userCredential.user.uid),{
                PhoneNo: phone,
                Email: email
            })
            .then(() => {
                window.location.href = './SecondaryRegister.html';
            })
        })
        .catch((error) => {
            Toast.error(error.message)
        });
    }
})