// Unified form handler for both data and selfie
const submitButton = document.getElementById('submitButton');
const unifiedForm = document.getElementById('unifiedForm');

submitButton.addEventListener('click', handleUnifiedSubmit);

function handleUnifiedSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: unifiedForm.nombre.value,
        correo: unifiedForm.correo.value,
        edad: unifiedForm.edad.value,
        comida: unifiedForm.comida.value,
    };
    
    const fileInput = document.getElementById('selfie');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor seleccioná una selfie.");
        return;
    }

    // Validate form data
    if (!formData.nombre || !formData.correo || !formData.edad || !formData.comida) {
        alert("Por favor completá todos los campos.");
        return;
    }

    console.log('Datos del formulario:', formData);

    const reader = new FileReader();
    reader.onload = function () {
        const base64Image = reader.result;
        console.log('Selfie convertida a base64');

        // Combine form data with selfie
        const completeData = {
            ...formData,
            selfie: base64Image
        };

        // Send both data and selfie to backend
        fetch('https://backformulary.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completeData)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(response => {
            console.log('Datos y selfie enviados:', response);
            alert('Datos y selfie enviados correctamente');
            unifiedForm.reset();
        })
        .catch(error => {
            console.error('Error enviando datos y selfie:', error);
            alert('Error al enviar los datos y selfie');
        });
    };
    
    reader.readAsDataURL(file); // convierte a base64
} 