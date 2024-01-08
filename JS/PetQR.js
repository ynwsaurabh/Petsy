import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from "./Toast.js"

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storagedb = getStorage(app)
const copy = document.getElementById('copy');
const whatsapp = document.getElementById('whatsapp');
const twitter = document.getElementById('twitter');
const facebook = document.getElementById('facebook');
document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, (user) => {
        const website = document.location.href;
        const domain = website.split("/");
        const url = `${domain[0]}//${domain[2]}/verify/generateqr.html?user=${user.uid}`;
        let width = 250;
        let height = 250;

        if (window.innerWidth < 750) {
            width = 150;
            height = 150;
        }
        const qr = new QRCode(document.getElementById("qrcard1"), {
            text: url,
            width: width,
            height: height,

        });
        facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}a&amp;display=popup`
        twitter.href = `https://twitter.com/share?url=${url}a&amp;text=[post-title]&amp;via=[via]&amp;hashtags=[hashtags]`
        whatsapp.href = `https://api.whatsapp.com/send?text=Hey, Check out my dog's account on Petsy: ${url}`
        copy.addEventListener('click', () => {
            navigator.clipboard.writeText(url)
            Toast.success("Copied to clipboard")
        })

    });
});

// const Checkbox = document.querySelector("#myCheckbox");

const checkbox = document.getElementById('myCheckbox');
const lostStatus = document.querySelector(".status");
const msgByOwner = document.querySelector(".msgByOwner");
const contactInfo = document.querySelector(".contactInfo");
const lostPetHeader = document.querySelector(".bgHeader");
const bio = document.querySelector(".bio");
const messageTitle = document.querySelector(".messageText");

const savedCheckboxState = localStorage.getItem('checkboxState');
// If there's a stored value, set the checkbox state accordingly
if (savedCheckboxState === 'checked') {
    checkbox.checked = true;
    messageTitle.style.color = '#ffffff';
    lostPetHeader.style.background = '#ff0000';
    lostStatus.style.display = 'initial';
    bio.style.display = 'none';
    msgByOwner.style.display = 'block';
    contactInfo.style.display = 'flex';
} else {
    checkbox.checked = false;
    messageTitle.style.color = 'black';
    lostPetHeader.style.background = '#ffd93d';
    lostStatus.style.display = 'none';
    bio.style.display = 'initial';
    msgByOwner.style.display = 'none';
    contactInfo.style.display = 'none';
}

// Check if the checkbox is checked
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        messageTitle.style.color = '#ffffff';
        messageTitle.style.color = '#ffffff';
        lostPetHeader.style.background = '#ff0000';
        lostStatus.style.display = 'initial';
        bio.style.display = 'none';
        msgByOwner.style.display = 'block';
        contactInfo.style.display = 'flex';
        localStorage.setItem('checkboxState', 'checked');
    }
    else {
        messageTitle.style.color = 'black';
        lostPetHeader.style.background = '#ffd93d';
        lostStatus.style.display = 'none';
        bio.style.display = 'initial';
        msgByOwner.style.display = 'none';
        contactInfo.style.display = 'none';
        localStorage.setItem('checkboxState', 'unchecked');
    }

})
// shareProfileCardTickIcon
const shareBtn = document.querySelector(".ProfileCardShareIcon");
const sharePannel = document.querySelector(".shareProfileCardPannel");
shareBtn.addEventListener('click', () => {
    shareBtn.classList.toggle('ProfileCardShareIconRotate');
    sharePannel.classList.toggle('sharePannelVisible');
})

const ProfilePicture = document.querySelector(".scanCardProfileImgContainer");
const Name = document.querySelector(".petName");
const Breed = document.querySelector(".dogBreed");
const Bio = document.querySelector(".bio");
const Gender = document.querySelector(".petInfoPrimary");
const vaccine = document.querySelector(".vaccinated");
const primaryContact = document.querySelector(".contactPrimary");
const secondaryContact = document.querySelector(".contactSecondary");
const OwnersMsg = document.querySelector(".msgByOwner");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid);
        get(userRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};
                Name.textContent = existingData.Name;
                Breed.textContent = 'Breed: ' + existingData.Breed;
                Bio.textContent = existingData.Bio;
                Gender.textContent = existingData.Gender + ' | ' + existingData.DOB;
                vaccine.textContent = 'Vaccinated: ' + existingData.Vaccinated;
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

                    OwnersMsg.textContent = existingData.Message;

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

                if (image) {
                    ProfilePicture.innerHTML = `<img class="profilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
                } else {

                }
                const downloadQR = document.querySelector(".qrbtn")
                downloadQR.addEventListener('click', () => {
                    const canvas = document.querySelector('canvas');
                    const dataUrl = canvas.toDataURL('image/png');

                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = `${existingData.Name}_Petsy.png`;
                    a.click();
                })


            })

    }
});

const primaryContactInp = document.getElementById('primaryContactno');
const alternateContactInp = document.getElementById('secondaryContactno');
const msgInp = document.getElementById('textarea');
const submitBtn = document.querySelector(".btn")

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const primaryContact = primaryContactInp.value;
    const alternateContact = alternateContactInp.value;
    const msg = msgInp.value;

    if (primaryContact.length < 10) {
        Toast.error("Please Enter Valide Number");
    }
    else if (alternateContact.length < 10) {
        Toast.error("Please Enter Valide Number");
    }
    else if (msg.length == 0) {
        Toast.error("Please Enter Message");
    }
    else {
        const user = auth.currentUser;
        const userRef = ref(db, 'UserAuthList/' + user.uid);
        get(userRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};

                // Merge existing data with new data
                const updatedData = {
                    ...existingData,
                    primaryContact: primaryContact,
                    secondaryContact: alternateContact,
                    Message: msg,

                };
                // Update the data
                return set(userRef, updatedData);
            })
            .then(() => {
                Toast.success("Details Saved");
                window.location.href = './PetQR.html';
            })
            .catch((error) => {
                const errorMessage = error.message;
                Toast.error(errorMessage);
            });
    }
})

function checkAuthAndRedirect() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = './verify/index.html';
        }
    });
}

checkAuthAndRedirect();