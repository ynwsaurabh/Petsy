import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storagedb = getStorage(app)

const Name = document.querySelector(".name");
const Breed = document.querySelector(".breed");
const Bio = document.querySelector(".bio");
const Gender = document.querySelector(".gender");
const Age = document.querySelector(".age");
const Address = document.querySelector(".address");
const ProfilePicture = document.querySelector(".userProfilePicture");
const editBtn = document.querySelector(".profileInfoEdit");
const editProfileWrapper = document.querySelector(".editProfileWrapper");

editBtn.addEventListener('click',() => {
    editProfileWrapper.style.display = 'block';
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid);
        get(userRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};
                Name.innerHTML = 'Name: ' + existingData.Name;
                Breed.textContent = 'Breed: ' + existingData.Breed;
                Bio.textContent = 'Bio: ' + existingData.Bio;
                Gender.textContent = 'Gender: ' + existingData.Gender;
                Age.textContent = 'DOB: ' + existingData.DOB;
                Address.textContent = 'Address: ' + existingData.Address;
                const image = existingData.profileImg;
                
                if (image) {
                    ProfilePicture.innerHTML = `<img class="profilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
                  } else {
          
                  }
            })

    }
});

// Check User Signed in

function checkAuthAndRedirect() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = './verify/Login.html';
        }
    });
}

checkAuthAndRedirect();