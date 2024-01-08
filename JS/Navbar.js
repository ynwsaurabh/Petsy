import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app)

const name = document.getElementById("navName");
const ProfilePicture = document.getElementById("navProfile");
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid);
        get(userRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};
                name.textContent = existingData.Name;
                const image = existingData.profileImg;
                if (image) {
                    ProfilePicture.innerHTML = `<img class="profilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
                } else {}
            })

    }
});

var Hamburger = document.querySelector(".Hamburger");
Hamburger.addEventListener('click', () =>{
    var bar = document.getElementsByClassName("bar");
    const ham = document.querySelector(".navbarLinksMenu");
    
    ham.classList.toggle("navbarLinksMenuShow");
    bar[0].classList.toggle("barOne");
    bar[1].classList.toggle("barTwo");
    bar[2].classList.toggle("barThree");

})
