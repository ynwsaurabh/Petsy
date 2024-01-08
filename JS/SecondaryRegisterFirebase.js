import { firebaseConfig} from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase,set, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from './Toast.js'

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storagedb = getStorage(app)

const submitBtn = document.querySelector("#submit");
const petNameInp = document.getElementById('petName');
const inputImage = document.getElementById('inputImage');
const petDOBInp = document.getElementById('petDOB');
const petBioInp = document.getElementById('Bio');
const petBreedInp = document.getElementById('petBreed');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const petName = petNameInp.value;
    const petBio = petBioInp.value;
    const petBreed = petBreedInp.value;
    const dob = new Date(petDOBInp.value);
    const profileImage = inputImage.files[0];
    const gender = document.querySelector('input[name="gender"]:checked');
    const vaccine = document.querySelector('input[name="playdate"]:checked');
    
        // Check if the entered date is valid
       const today = new Date();
       let ageInMilliseconds = today - dob;
    
       const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;
       const MS_PER_MONTH = MS_PER_YEAR / 12; 
    
       const ageInYears = Math.floor(ageInMilliseconds / MS_PER_YEAR);
       ageInMilliseconds %= MS_PER_YEAR;
    
       const ageInMonths = Math.floor(ageInMilliseconds / MS_PER_MONTH);
       ageInMilliseconds %= MS_PER_MONTH;
    
       const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
       let petDOB;
    
       if (ageInYears >= 1) {
        petDOB = ageInYears + " years";
    } else if (ageInMonths >= 1) {
        petDOB = ageInMonths + " months";
    } else if(ageInDays >= 1) {
        petDOB = ageInDays + " days";
    }
    else{
        Toast.error("Invalid date of birth")
    }
    console.log(petDOB);
    
    if(petName.length == 0){
        Toast.error("Please Enter Name!");
    }
    else if(petDOB.length == 0){
        Toast.error("Please Enter DOB!");
    }
    else if(petBreed.length == 0){
        Toast.error("Please Select Breed");
    }
    else if(!gender){
        Toast.error("Please Select Gender.")
    }
    else if(!vaccine){
        Toast.error("Please Select Vaccinated.")
    }
    else if(!profileImage){
        Toast.error("Please select a Progile Image");
    }
    else{
    const user = auth.currentUser;
    const userRef = ref(db, 'UserAuthList/' + user.uid);

    const imagesRef = storageRef(storagedb, 'profile_images/' + user.uid + '/profimeImg');
    uploadBytes(imagesRef, profileImage).then((snapshot) => {
        console.log('Image uploaded successfully.');
    
        // Get the download URL
        getDownloadURL(imagesRef).then((downloadURL) => {
                get(userRef)
                    .then((snapshot) => {
                        const existingData = snapshot.val() || {};

                        // Merge existing data with new data
                        const updatedData = {
                            ...existingData,
                            profileImg: downloadURL || '',
                            Uid: user.uid,
                            Name: petName,
                            DOB: petDOB,
                            Breed: petBreed,
                            Gender: gender.value,
                            Vaccinated: vaccine.value,
                            Bio: petBio || "",
                            Address:""
                        };

                        // Update the data
                        return set(userRef, updatedData);
                    })
                    .then(() => {
                        console.log('Data stored/updated successfully');
                        window.location.href = '../Profile.html';
                    })
                    .catch((error) => {
                        // Handle errors
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error('Error:', errorCode, errorMessage);
                    });
            });
        }
    );
    }
});

// Check User Signed in

function checkAuthAndRedirect() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        Toast.error("Please Login First")
        window.location.href = './Login.html';
      }
    });
  }
  
  checkAuthAndRedirect();