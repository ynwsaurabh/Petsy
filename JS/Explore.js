import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from "./Toast.js"
import { firebaseConfig } from "./Config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const cardTemplate = document.querySelector("[data-cardTemplate]");
const cardContainer = document.querySelector("[data-cardContainer]");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // console.log(user.uid);
        const userRef = ref(db, 'UserAuthList/');
        get(userRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((userId) => {
                    if (userId !== user.uid) {
                        const userData = data[userId];
                        const card = cardTemplate.content.cloneNode(true).children[0];

                        const Name = card.querySelector("[data-petName]");
                        const Breed = card.querySelector("[data-petBreed]");
                        const Bio = card.querySelector("[data-petBio]");
                        const Gender = card.querySelector("[data-petGender]");
                        const ProfilePicture = card.querySelector("[data-profilePicture]");
                        const connectBtn = card.querySelector("[data-connect]");

                        Name.textContent = userData.Name;
                        Breed.textContent = userData.Breed;
                        Bio.textContent = userData.Bio;
                        Gender.textContent = userData.Gender + " |";
                        const image = userData.profileImg;
                        if (image) {
                            ProfilePicture.innerHTML = `<img class="profilePicture" src="${userData.profileImg}" alt="Preview" loading="lazy" />`
                        } else { }

                        const statusRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsSent');
                        get(statusRef).then((snapshot) => {
                            const btnStatus = snapshot.val();
                            if (btnStatus) {
                                Object.keys(btnStatus).forEach((statusBtn) => {
                                    const check = btnStatus[statusBtn];
                                    if (check.Uid == userData.Uid) {
                                        connectBtn.textContent = 'Pending...'
                                    }
                                })
                            }
                        });

                        const friendRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/AllFriends');
                        get(friendRef).then((snapshot) => {
                            const friendStatus = snapshot.val();
                            if (friendStatus) {
                                Object.keys(friendStatus).forEach((friends) => {
                                    const friend = friendStatus[friends];
                                    if (friend.Uid == userData.Uid) {
                                        connectBtn.style.display = 'none';
                                    }
                                })
                            }
                        });

                        card.addEventListener('click', () => {
                            window.location.href = `/userProfile.html?user=${userId}&currentUser=${user.uid}`;
                        });

                        connectBtn.addEventListener('click', (event) => {
                            event.stopPropagation();

                            if (connectBtn.textContent === "Pending...") {
                                Toast.error("Request already sent!");
                                return;
                            }

                            connectBtn.textContent = 'Pending...'

                            // Assume id is the friendUserId
                            const friendUserId = userData.Uid;
                            const currentUserId = user.uid;

                            const currentUserRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsSent');
                            const friendUserRef = ref(db, 'UserAuthList/' + friendUserId + '/Friends' + '/requestsReceived');

                            try {
                                // Update the current user's requestsSent
                                const requestExists = get(currentUserRef, friendUserId).then(() => {
                                    const newCurrentUserRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsSent' + `/${friendUserId}`);

                                    set(newCurrentUserRef, { Uid: friendUserId }, true);
                                });

                                // Update the friend user's requestsReceived
                                const requestReceivedExists = get(friendUserRef, friendUserId).then(() => {
                                    const ReceivednewPath = `/${user.uid}`;
                                    const newFriendUserRef = ref(db, 'UserAuthList/' + friendUserId + '/Friends' + '/requestsReceived' + ReceivednewPath);
                                    const currentuserRef = ref(db, 'UserAuthList/' + user.uid);
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
                                connectBtn.textContent = 'Connect +'
                            }
                        });
                        cardContainer.append(card);
                    }
                });
            }
        });
    }
});

// Function to create the skeleton card
function createExploreCardSkeleton() {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'skeletonExploreCardWrapper';

    const circle = document.createElement('div');
    circle.className = 'skeletonExploreCircle skeleton';
    cardWrapper.appendChild(circle);

    const textContainer = document.createElement('div');
    textContainer.className = 'skeletonExploreTextContainer';

    const text1 = document.createElement('div');
    text1.className = 'skeletonText50 skeleton';
    textContainer.appendChild(text1);

    const text2 = document.createElement('div');
    text2.className = 'skeletonText30 skeleton';
    textContainer.appendChild(text2);

    const text3 = document.createElement('div');
    text3.className = 'skeletonText100 skeleton';
    textContainer.appendChild(text3);

    cardWrapper.appendChild(textContainer);

    return cardWrapper;
}
const insertSkeletonCards = () => {
    const container = document.getElementById('profile-card-container');
    for (let i = 0; i < 9; i++) {
        const skeletonCard = createExploreCardSkeleton();
        container.appendChild(skeletonCard);
    }
}

// document.addEventListener('DOMContentLoaded', insertSkeletonCards)
// Check User Signed in

function checkAuthAndRedirect() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = './index.html';
        }
    });
}

checkAuthAndRedirect();