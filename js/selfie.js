// Para el formulario de selfie
const button2 = document.getElementById('submit2');
button2.addEventListener('click', handleSelfieSubmit);

function handleSelfieSubmit(e) {
    e.preventDefault();
    const formSelfie = document.getElementById('form2');
    const fileInput = document.getElementById('selfie');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor seleccioná una selfie.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const base64Image = reader.result;

        console.log(base64Image);
        console.log('selfie enviada');
        

        fetch('/api/selfie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selfie: base64Image })
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(response => {
            console.log("Selfie enviada al backend:", response);
            alert('Selfie enviada correctamente');
            formSelfie.reset();
        })
        .catch(error => {
            console.error('Error enviando selfie:', error);
            alert('Error al enviar la selfie');
        });
    };
    reader.readAsDataURL(file); // convierte a base64
}