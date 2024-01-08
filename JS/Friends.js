import { firebaseConfig } from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, remove, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js'
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const friendsCardTemplate = document.querySelector('[data-FriendTemplate]');
const Container = document.querySelector('.friendsCardContainer');
const noFriends = document.querySelector('#noFriends');
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/AllFriends');
        get(userRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((userId) => {
                    const userData = data[userId];
                    if (userData) {
                        noFriends.style.display = 'none';
                        const card = friendsCardTemplate.content.cloneNode(true).children[0];

                        const Name = card.querySelector("[data-Name]");
                        const ProfilePicture = card.querySelector("[data-Profile]");
                        const Bio = card.querySelector("[data-Bio]");
                        const removeBtn = card.querySelector("[data-Remove]");

                        Name.textContent = userData.Name;
                        Bio.textContent = userData.Bio;
                        const image = userData.Profile;
                        if (image) {
                            ProfilePicture.innerHTML = `<img class="friendsProfilePicture" src="${userData.Profile}" alt="Preview" loading="lazy" />`
                        } else { }

                        removeBtn.addEventListener('click', () => {
                            const friendRef = ref(db, 'UserAuthList/' + user.uid + '/Friends' + '/AllFriends' + `/${userData.Uid}`);
                            const friendsRef = ref(db, 'UserAuthList/' + userData.Uid + '/Friends' + '/AllFriends' + `/${user.uid}`);
                            remove(friendRef).then(() => { remove(friendsRef).then(() =>{
                                card.remove();
                            }) });
                            Toast.success('Removed from Friend list')
                        });

                        Container.append(card);
                    } else {
                        noFriends.style.display = '';
                    }
                });
            }
        });
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