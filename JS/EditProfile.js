import { firebaseConfig } from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, update, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from "./Toast.js"

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storagedb = getStorage(app)

const editImageIcon = document.querySelector(".editImageIcon");
const inputImage = document.getElementById("inputImage");
editImageIcon.addEventListener('click', (e) => {
    e.preventDefault;
    inputImage.click();
})
inputImage.addEventListener("change", (event) => {
    const container = document.querySelector(".circular-container");
    const image = event.target.files[0];

    container.innerHTML = image
        ? `<img class="profilePicture" src="${URL.createObjectURL(image)}" alt="Preview" loading="lazy" />`
        : `<PiDogFill class="profileIcon" />`;
});

// textarea on change
document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('editBio');
    const charCount = document.querySelector(".textareaCount");

    textarea.addEventListener('input', function () {
        const count = textarea.value.length;
        charCount.textContent = count + '/100';
    });
});

const closeBtn = document.querySelector(".closeBtn");
const Name = document.querySelector("#editName");
const Breed = document.querySelector("#petBreed");
const Bio = document.querySelector("#editBio");
const Gender = document.querySelector("#editGender");
const DOB = document.querySelector("#editDOB");
const Address = document.querySelector("#editAddress");
const ProfilePicture = document.querySelector(".circular-container");

const editProfileWrapper = document.querySelector(".editProfileWrapper");

closeBtn.addEventListener('click', () => {
    editProfileWrapper.style.display = 'none';
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid);
        get(userRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};
                Name.value = existingData.Name;
                Breed.value = existingData.Breed;
                Bio.textContent = existingData.Bio;
                Gender.value = existingData.Gender;
                DOB.value = existingData.DOB;
                Address.value = existingData.Address;
                const image = existingData.profileImg;

                if (image) {
                    ProfilePicture.innerHTML = `<img class=" editProfilePhoto profilePicture" src="${existingData.profileImg}" alt="Preview" loading="lazy" />`;
                } else {

                }
            })

    }
});

const saveBtn = document.querySelector(".btn");
const upName = document.querySelector("#editName");
const upBreed = document.querySelector("#petBreed");
const upBio = document.querySelector("#editBio");
const upGender = document.querySelector("#editGender");
const upDOB = document.querySelector("#editDOB");
const upAddress = document.querySelector("#editAddress");

saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const petName = upName.value;
    const petDOB = upDOB.value;
    const petBio = upBio.value;
    const petBreed = upBreed.value;
    const gender = upGender.value;
    const Address = upAddress.value;
    const inputUpImage = document.getElementById("inputImage");
    const profileImage = inputUpImage.files[0];

    // Get the current user
    const user = auth.currentUser;
    const userRef = ref(db, 'UserAuthList/' + user.uid);

    await get(userRef)
        .then((snapshot) => {
            const existingData = snapshot.val() || {};
            try {
                // If a new profile image is uploaded
                if (inputUpImage.files[0]) {
                    const imagesRef = storageRef(storagedb, 'profile_images/' + user.uid + '/profileImg');
                    uploadBytes(imagesRef, profileImage);
                    getDownloadURL(imagesRef).then((downloadURL) => {

                        // Update all fields, including the profile image
                        set(userRef, {
                            ...existingData,
                            profileImg: downloadURL,
                            Uid: user.uid,
                            Name: petName,
                            DOB: petDOB,
                            Breed: petBreed,
                            Gender: gender,
                            Bio: petBio || "",
                            Address: Address || ""
                        })
                    })
                    .then(() => {
                        window.location.href = './Profile.html'
                    });
                } else {
                    // If no new profile image, update other fields
                    update(userRef, {
                        ...existingData,
                        Name: petName,
                        DOB: petDOB,
                        Breed: petBreed,
                        Gender: gender,
                        Bio: petBio || "",
                        Address: Address || ""
                    })
                        .then(() => {
                            window.location.href = './Profile.html'
                        });
                }
                Toast.success('Data updated successfully')
                console.log('Data stored/updated successfully');
                editProfileWrapper.style.display = 'none';
            } catch (error) {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error:', errorCode, errorMessage);
                Toast.error('Error updating profile. Please try again.');
            }
        });
});
