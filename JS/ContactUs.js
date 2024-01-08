import * as Toast from './Toast.js'

const submitBtn = document.getElementById('submitBtn');
document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();
    sendMail();
});
function sendMail() {
    const Name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    var params ={
        name: Name,
        email: email,
        message: message
    }

    const serviceId = 'service_petsy'
    const templateId= 'template_petsy'

    emailjs.send(serviceId, templateId, params)
    .then((res)=>{
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
            console.log(res)
        })
        .then(() =>{
            Toast.success("Your message sent successfully!" );

        })
        .catch((error) => {
            const errorMessage = error.message;
            Toast.error(errorMessage);
        });

}
