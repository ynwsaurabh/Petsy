import { firebaseConfig } from '../JS/Config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, remove, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js'
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const noNewNotification = document.querySelector('.noNewNotification');
const dropDownContainer = document.querySelector('.dropDownContainer');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsReceived');
        get(userRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((userId) => {
                    const userData = data[userId];

                    if (userData) {
                        noNewNotification.style.display = 'none';

                        const card = `<h2>Notifications</h2>
                                    <div class="cardContainer allNotificationCardContainer">
                                         <img class="profilePicture allNotificationImg" src=${userData.Profile} alt="Profile" loading="lazy">
                                         <div class="dogInfoContainer">
                                            <div class="dogInformation">
                                                <h2 class="allNotificationName">Friend request</h2>
                                                <p class="allNotificationText">You have recieved a friend request from ${userData.Name}</p>
                                            </div> 
                                            <div class="addPlaydate">
                                                <svg id='Accept' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="addPlaydateIcon null" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                                </svg>
                                                <svg id='Decline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="addPlaydateIcon null" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>`

                        dropDownContainer.innerHTML = card;
                        const Accept = document.getElementById('Accept');
                        const Decline = document.getElementById('Decline');
                        const cardContainer = document.querySelector('.cardContainer');

                        Accept.addEventListener('click', () => {

                            onAuthStateChanged(auth, (userr) => {
                                const currentuserRef = ref(db, 'UserAuthList/' + userr.uid);
                                get(currentuserRef)
                                    .then((snapshot) => {
                                        const existingData = snapshot.val() || {};
                                        console.log(existingData.Name);

                                        const friends = {
                                            Uid: userData.Uid,
                                            Name: userData.Name,
                                            Bio: userData.Bio,
                                            Profile: userData.Profile
                                        }
                                        
                                        const friendRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/AllFriends');
                                        const friendsRef = ref(db, 'UserAuthList/' + userData.Uid + '/Friends' + '/AllFriends' + `/${user.uid}`);
                                        const requestExists = get(friendRef, userData.Uid).then(() => {
                                            const newPath = `/${userData.Uid}`;
                                            const newFriendRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/AllFriends' + newPath);
                                            set(newFriendRef, friends);
                                            set(friendsRef, {
                                                Uid: existingData.Uid ,
                                                Name: existingData.Name,
                                                Bio: existingData.Bio,
                                                Profile: existingData.profileImg
                                            });
                                            Toast.success('You are now Friends!')
                                        });
                                    });
                            });

                            const statusRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsSent' + `/${userData.Uid}`);
                            const sRef = ref(db, 'UserAuthList/' + userData.Uid + '/Friends' + '/requestsSent' + `/${user.uid}`);
                            remove(statusRef)
                                .then(() => { remove(sRef) })


                            const removeRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsReceived' + `/${userData.Uid}`)
                            const removefRef = ref(db, 'UserAuthList/' + userData.Uid + '/Friends' + '/requestsReceived' + `/${user.uid}`)
                            remove(removeRef).then(() => { remove(removefRef) })


                            cardContainer.style.display = 'none';
                            noNewNotification.style.display = 'flex';
                        });

                        Decline.addEventListener('click', () => {
                            cardContainer.style.display = 'none';
                            const removeRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/requestsReceived' + `/${userData.Uid}`)
                            remove(removeRef)
                                .then(() => {
                                    Toast.success('Removed from request')
                                })
                        });
                    }
                });
            }
        });
    }
});

const handleDropDown = () => {
    var container = document.querySelector(".notificationContainer");
    var svg = document.querySelector(".notificationIcon");
    if (container.classList.toggle("inactive")) {
        svg.style.color = "#ff0000";
    }
    else {
        svg.style.color = "white";
    }
    svg.classList.toggle("inactive");
}
const handleDropDown1 = document.getElementById('handleDropDown').addEventListener('click', handleDropDown)