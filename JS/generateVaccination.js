import { firebaseConfig } from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, update, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const userId = getQueryParam('user')
const useridRef = ref(db, 'UserAuthList/' + userId );
get(useridRef)
            .then((snapshot) => {
                const userData = snapshot.val() || {}
                petName.textContent = userData.Name;
                breed.textContent = userData.Breed;
            })

const dogWeightunit = document.querySelector(".dogWeightunit");
const vetHonorific = document.querySelector(".vetHonorific");
const allergiesInp = document.getElementById("allergiesInp");
const conditionsInp = document.getElementById("conditionsInp");
const contactInp = document.getElementById("contactInp");
const locationInp = document.getElementById("locationInp");

const vaccineRef = ref(db, 'UserAuthList/' + userId + '/VaccinationDetails');
get(vaccineRef)
            .then((snapshot) => {
                const existingData = snapshot.val() || {};
                if (existingData.Weight) {
                    dogWeightunit.style.opacity = 1
                    weightInp.value = existingData.Weight;
                }
                if (existingData.DrName) {
                    vetHonorific.style.opacity = 1
                    drNameInp.value = existingData.DrName;
                }
                if (existingData.Allergies) {
                    allergiesInp.value = existingData.Allergies;
                }
                if (existingData.Condition) {
                    conditionsInp.value = existingData.Condition;
                }
                if (existingData.DrContact) {
                    contactInp.value = existingData.DrContact;
                }
                if (existingData.Location) {
                    locationInp.value = existingData.Location;
                }
            });



const tableTemplate = document.querySelector("[data-table-tmplate]");
const tBody = document.querySelector("#tBody");

const userRef = ref(db, 'UserAuthList/' + userId + '/VaccinationDetails' + '/AllDetails');
get(userRef).then((snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((vaccineKey) => {
            const userData = data[vaccineKey];
            const card = tableTemplate.content.cloneNode(true).children[0];

            const Name = card.querySelector("[data-name]");
            const Batch = card.querySelector("[data-batch]");
            const Date = card.querySelector("[data-date]");
            const NextDate = card.querySelector("[data-nextDate]");

            Name.textContent = userData.vaccineName;
            Batch.textContent = userData.vaccineBatch;
            Date.textContent = userData.vaccineDate;
            NextDate.textContent = userData.vaccineNextDate;

            tBody.append(card);

        });
    }
});
