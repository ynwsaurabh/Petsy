import { firebaseConfig } from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, remove , get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js'
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
console.log(userId)
const currentUser = getQueryParam('currentUser')
const Name = document.querySelector("#userName");
const Breed = document.querySelector("#breed");
const Bio = document.querySelector("#bio");
const Gender = document.querySelector("#gender");
const Age = document.querySelector("#age");
const Vaccine = document.querySelector("#vaccine");
const ProfilePicture = document.querySelector(".exploreUserProfilePictureContainer");
const profileButton = document.querySelector("#profileButton");


const userRef = ref(db, 'UserAuthList/' + userId);
get(userRef)
    .then((snapshot) => {
        const existingData = snapshot.val() || {};
        Name.textContent = existingData.Name;
        Breed.innerHTML = 'Breed' + `<p>${existingData.Breed}</p>`;
        Bio.textContent = existingData.Bio;
        Gender.innerHTML = 'Gender' + `<p>${existingData.Gender}</p>`;
        Age.innerHTML = 'Age' + `<p>${existingData.DOB}</p>`;
        Vaccine.innerHTML = 'Vaccinated: ' + `<p>${existingData.Vaccinated}</p>`;
        const image = existingData.profileImg;

        if (image) {
            ProfilePicture.innerHTML = `<img class="exploreUserProfilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
        } else {

        }
    })

const statusRef = ref(db, 'UserAuthList/' + currentUser + '/Friends' + '/requestsSent');
get(statusRef).then((snapshot) => {
    const btnStatus = snapshot.val();
    if (btnStatus) {
        Object.keys(btnStatus).forEach((statusBtn) => {
            const check = btnStatus[statusBtn];
            if (check.Uid == userId) {
                profileButton.textContent = 'Pending...'
            }
        })
    }
});
const checkFriendRef = ref(db, 'UserAuthList/' + currentUser + '/Friends' + '/AllFriends');
get(checkFriendRef).then((snapshot) => {
    const btnStatus = snapshot.val();
    if (btnStatus) {
        Object.keys(btnStatus).forEach((statusBtn) => {
            const check = btnStatus[statusBtn];
            if (check.Uid == userId) {
                profileButton.textContent = 'Remove'
            }
        })
    }
});

profileButton.addEventListener('click', () => {
    if (profileButton.textContent === "Pending...") {
        Toast.error("Request already sent!");
        return;
    }
    if (profileButton.textContent === "Remove") {
        const friendRef = ref(db, 'UserAuthList/' + currentUser + '/Friends' + '/AllFriends' + `/${userId}`);
        const friendsRef = ref(db, 'UserAuthList/' + userId + '/Friends' + '/AllFriends' + `/${currentUser}`);
        remove(friendRef).then(() => { remove(friendsRef) });
            profileButton.textContent = 'Connect +'
            Toast.error("Removed from friend list!");
            return;
        }

    profileButton.textContent = 'Pending...'

    // Assume id is the friendUserId
    const friendUserId = userId;
        const currentUserId = currentUser;

        const currentUserRef = ref(db, 'UserAuthList/' + currentUser + '/Friends' + '/requestsSent');
        const friendUserRef = ref(db, 'UserAuthList/' + friendUserId + '/Friends' + '/requestsReceived');

        try {
            // Update the current user's requestsSent
            const requestExists = get(currentUserRef, friendUserId).then(() => {
                const newCurrentUserRef = ref(db, 'UserAuthList/' + currentUser + '/Friends' + '/requestsSent' + `/${friendUserId}`);

                set(newCurrentUserRef, { Uid: friendUserId }, true);
            });

            // Update the friend user's requestsReceived
            const requestReceivedExists = get(friendUserRef, friendUserId).then(() => {
                const ReceivednewPath = `/${currentUser}`;
                const newFriendUserRef = ref(db, 'UserAuthList/' + friendUserId + '/Friends' + '/requestsReceived' + ReceivednewPath);
                const currentuserRef = ref(db, 'UserAuthList/' + currentUser);
                get(currentuserRef).then((snapshot) => {
                    const currentUserdata = snapshot.val();

                    const friendsData = {
                        Uid: currentUserdata.Uid,
                        Name: currentUserdata.Name,
                        Bio: currentUserdata.Bio,
                        Profile: currentUserdata.profileImg
                    }
                    set(newFriendUserRef, friendsData, true);
                });

            });
            Toast.success("Request successfully sent.");
        } catch (error) {
            Toast.error("There was an error. Please try again or refresh the page.");
            profileButton.textContent = 'Connect +'
        }
    });


// Check User Signed in
function checkAuthAndRedirect() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = './verify/index.html';
        }
    });
}

checkAuthAndRedirect();