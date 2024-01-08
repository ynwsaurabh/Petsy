import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutButtons = document.querySelectorAll("#logout");

logoutButtons.forEach((logout) => {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        window.location.href = '../verify/index.html';
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
});
