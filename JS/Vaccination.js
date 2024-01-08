import { firebaseConfig } from "./Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, update, get, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import * as Toast from "./Toast.js"

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const copy =document.getElementById('copy');
const whatsapp =document.getElementById('whatsapp');
const pdfBtn =document.getElementById('pdf');

pdfBtn.addEventListener('click', function () {
    window.jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();
    const element = document.querySelector('.vaccinationWrapper');
    const excludedElements = ['#downloadButton', '.shareIconContainer', '.sharePannel', '#vaccinationButton']
  
    html2canvas(element, {
        scale: 5,
        useCORS: true,
        ignoreElements: function (element) {
            return excludedElements.some(selector => element.matches(selector));
        }
    })
    .then(canvas => {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
        pdf.save('Pet Health Card.pdf');
    });
  });

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, (user) => {
        const website = document.location.href;
        const domain = website.split("/");
        const url = `${domain[0]}//${domain[2]}/verify/generateVaccination.html?user=${user.uid}`;

        whatsapp.href = `https://api.whatsapp.com/send?text=Hey, Check out my dog's vaccinations: ${url}`
        copy.addEventListener('click', () => {
            navigator.clipboard.writeText(url)
            Toast.success("Copied to clipboard")
        })

    });
});

const shareIconContainer = document.querySelector(".shareIconContainer");
const sharePannel = document.querySelector(".sharePannel");
const button = document.querySelector("#vaccinationButton");
const addButton = document.querySelector(".addBtn");
const dogWeightunit = document.querySelector(".dogWeightunit");
const vetHonorific = document.querySelector(".vetHonorific");
const inputs = document.querySelectorAll('input')

const weightInp = document.getElementById("weightInp");
const drNameInp = document.getElementById("drNameInp");

weightInp.addEventListener("input", function () {
    if (weightInp.value.trim() !== "") {
        dogWeightunit.style.opacity = 1;
    } else {
        dogWeightunit.style.opacity = 0;
    }
});
drNameInp.addEventListener("input", function () {
    if (drNameInp.value.trim() !== "") {
        vetHonorific.style.opacity = 1;
    } else {
        vetHonorific.style.opacity = 0;
    }
});

let isPanelVisible = false;
shareIconContainer.addEventListener('click', () => {
    isPanelVisible = !isPanelVisible
    if (isPanelVisible) {
        sharePannel.style.display = "flex";
    } else {
        sharePannel.style.display = "none";
    }
});

button.addEventListener("click", function () {
    if (button.classList.contains("editButton")) {
        button.innerHTML = `
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="editIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"></path>
            </svg>
            &nbsp; Save
        `;
        button.classList.remove("editButton");
        button.classList.add("saveButton");

        inputs.forEach(function (input) {
            input.disabled = false;
        });

    } else {
        button.innerHTML = `
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="editIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                    </svg>
                    &nbsp; Edit
                    `;
        button.classList.remove("saveButton");
        button.classList.add("editButton");

        inputs.forEach(function (input) {
            input.disabled = true;
        });

        const allergiesInp = document.getElementById("allergiesInp");
        const conditionsInp = document.getElementById("conditionsInp");
        const contactInp = document.getElementById("contactInp");
        const locationInp = document.getElementById("locationInp");

        const weight = weightInp.value;
        const allergies = allergiesInp.value;
        const condition = conditionsInp.value;
        const drName = drNameInp.value;
        const contact = contactInp.value;
        const location = locationInp.value;

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(db, 'UserAuthList/' + user.uid + '/VaccinationDetails');
                get(userRef)
                    .then((snapshot) => {
                        const existingData = snapshot.val() || {};
                        set(userRef, {
                            ...existingData,
                            Weight: weight || '',
                            Allergies: allergies || '',
                            Condition: condition || '',
                            DrName: drName || '',
                            DrContact: contact || '',
                            Location: location || ''
                        })
                    })
                    .then(() => {
                        Toast.success('Data Saved');
                    })
                    .catch((error) => {
                        Toast.error(error.message)
                    });
            }
        });

    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        const useridRef = ref(db, 'UserAuthList/' + user.uid);
        const userRef = ref(db, 'UserAuthList/' + user.uid + '/VaccinationDetails');
        const petName = document.getElementById('petName')
        const breed = document.getElementById('breed')
        get(useridRef)
            .then((snapshot) => {
                const userData = snapshot.val() || {}
                petName.textContent = userData.Name;
                breed.textContent = userData.Breed;
            })

        get(userRef)
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
    }
});
const tr = document.getElementById('tr');
addButton.addEventListener("click", function () {
    if (addButton.classList.contains("addBtn")) {
        addButton.innerHTML = `
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="editIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"></path>
        </svg>
        &nbsp; Save
        `;
        addButton.classList.remove("addBtn");
        addButton.classList.add("saveBtn");
        tr.style.display = '';

    } else {
        const vNameInp = document.getElementById('vName');
        const vBatchInp = document.getElementById('vBatch');
        const vDateInp = document.getElementById('vDate');
        const vNextDateInp = document.getElementById('vNextDate');

        const vName = vNameInp.value;
        const vBatch = vBatchInp.value;
        const vDate = vDateInp.value;
        const vNextDate = vNextDateInp.value;

        if (!vName && !vBatch && !vDate && !vNextDate) {
            tr.style.display = 'none';
            Toast.error('You cancelled');
            addButton.innerHTML = `
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1551322312294" viewBox="0 0 1024 1024" version="1.1" class="addIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path><path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
            </svg>&nbsp; Add
            `;
        addButton.classList.remove("saveBtn");
        addButton.classList.add("addBtn");
        }
        else if (vName.trim() == '') {
            Toast.error('Enter Name')
        }
        else if (vBatch.trim() == '') {
            Toast.error('Enter Batch Number')
        }
        else if (vDate.trim() == '') {
            Toast.error('Enter Date')
        }
        else if (vNextDate.trim() == '') {
            Toast.error('Enter Next Date')
        }
        else {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userRef = ref(db, 'UserAuthList/' + user.uid + '/VaccinationDetails' + '/AllDetails');

                    get(userRef)
                        .then((snapshot) => {
                            const detailsCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
                            const newPath = `/Details${detailsCount + 1}`;
                            const newDetailRef = ref(db, 'UserAuthList/' + user.uid + '/VaccinationDetails/' + '/AllDetails' + newPath);
                            set(newDetailRef, {
                                vaccineName: vName || '',
                                vaccineBatch: vBatch || '',
                                vaccineDate: vDate || '',
                                vaccineNextDate: vNextDate || ''
                            })
                        })
                        .then(() => {
                            Toast.success('Data Saved');
                            tr.style.display = 'none';
                            window.location.href = './Vaccination.html'
                        })
                        .catch((error) => {
                            Toast.error(error.message)
                        });
                }
            });
        }

    }
});

const tableTemplate = document.querySelector("[data-table-tmplate]");
const tBody = document.querySelector("#tBody");
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'UserAuthList/' + user.uid + '/VaccinationDetails' + '/AllDetails');

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