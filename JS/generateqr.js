import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storagedb = getStorage(app)

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the user ID from the URL
const userId = getQueryParam('user');

const Name = document.querySelector("#userName");
const Breed = document.querySelector("#breed");
const Bio = document.querySelector("#bio");
const Gender = document.querySelector("#gender");
const Vaccine = document.querySelector("#vaccinated");
const connectBtn = document.querySelector("#connectBtn");
const ProfilePicture = document.querySelector(".scanCardProfileImgContainer");
const msgByOwner = document.querySelector(".msgByOwner");
const primaryContact = document.querySelector(".contactPrimary");
const secondaryContact = document.querySelector(".contactSecondary");
const contactInfo = document.querySelector(".contactInfo");
const status = document.querySelector(".status");

const userRef = ref(db, 'UserAuthList/' + userId);
get(userRef)
    .then((snapshot) => {
        const existingData = snapshot.val() || {};
        Name.textContent = existingData.Name;
        Breed.textContent = 'Breed: ' + existingData.Breed;
        Bio.textContent = existingData.Bio;
        Gender.textContent = existingData.Gender + ' | ' + existingData.DOB;
        Vaccine.textContent = 'Vaccinated: ' + existingData.Vaccinated;
        const primary = existingData.primaryContact;
        const secondary = existingData.secondaryContact;
        const customMsg = existingData.Message;
        if (primary && secondary && customMsg) {
            primaryContact.innerHTML = `<svg stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="callIcon"
                height="1em" width="1em"
                xmlns="http://www.w3.org/2000/svg"><path
                d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                &nbsp;`+ existingData.primaryContact;

            msgByOwner.textContent = existingData.Message;

            secondaryContact.innerHTML = `<svg stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="callIcon"
                height="1em" width="1em"
                xmlns="http://www.w3.org/2000/svg"><path
                d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                &nbsp;`+ existingData.secondaryContact;
        } else { }
        const image = existingData.profileImg;
        const website = document.location.href;
        const domain = website.split("/");
        connectBtn.href = `${domain[0]}//${domain[2]}/userProfile.html?user=${userId}`;
        if (image) {
            ProfilePicture.innerHTML = `<img class="scanCardProfilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
        } else {

        }
    })

    const savedCheckboxState = localStorage.getItem('checkboxState');
    console.log(savedCheckboxState);
    
    if (savedCheckboxState === 'checked') {
        connectBtn.style.display = 'none';
        status.style.display = 'initial';
        msgByOwner.style.display = 'block';
        Bio.style.display = 'none';
        contactInfo.style.display = 'flex';
    } else {
        connectBtn.style.display = 'initial';
        status.style.display = 'none';
        msgByOwner.style.display = 'none';
        Bio.style.display = 'initial';
        contactInfo.style.display = 'none';
    }
