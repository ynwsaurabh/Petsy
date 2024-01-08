const handleCircularClick = () => {
    // Trigger the file input when the circular container is clicked
    const inputImage = document.getElementById("inputImage");
    inputImage.click();
};
const inputImage = document.getElementById("inputImage");

inputImage.addEventListener("change", (event) => {
    const container = document.querySelector(".circular-container");
    const image = event.target.files[0];

    container.innerHTML = image
        ? `<img class="profilePicture" src="${URL.createObjectURL(image)}" alt="Preview" loading="lazy" />`
        : `<PiDogFill class="profileIcon" />`;
});

     // textarea on change
     document.addEventListener('DOMContentLoaded', function () {
        const textarea = document.getElementById('Bio');
        const charCount = document.querySelector(".textareaCount");

        textarea.addEventListener('input', function () {
            const count = textarea.value.length;
            charCount.textContent =  count + '/100';
        });
    });