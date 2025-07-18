// Unified form handler for both data and selfie
const submitButton = document.getElementById('submitButton');
const unifiedForm = document.getElementById('unifiedForm');

submitButton.addEventListener('click', handleUnifiedSubmit);

function handleUnifiedSubmit(e) {
    e.preventDefault();
    console.log('🚀 Función handleUnifiedSubmit ejecutada');
    
    const formData = {
        nombre: unifiedForm.nombre.value,
        correo: unifiedForm.correo.value,
        edad: unifiedForm.edad.value,
        comida: unifiedForm.comida.value,
    };
    
    console.log('📝 Datos del formulario:', formData);
    
    const fileInput = document.getElementById('selfie');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor seleccioná una selfie.");
        return;
    }

    console.log('📸 Archivo seleccionado:', file.name);

    // Validate form data
    if (!formData.nombre || !formData.correo || !formData.edad || !formData.comida) {
        alert("Por favor completá todos los campos.");
        return;
    }

    console.log('✅ Validación pasada, iniciando FileReader');

    const reader = new FileReader();
    reader.onload = function () {
        const base64Image = reader.result;
        console.log('️ Selfie convertida a base64, longitud:', base64Image.length);

        // Combine form data with selfie
        const completeData = {
            ...formData,
            selfie: base64Image
        };

        console.log('📤 Enviando datos al backend...');
        console.log(' URL del backend:', 'https://backformulary.onrender.com/api/register');

        // Send both data and selfie to backend
        fetch('https://backformulary.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completeData)
        })
        .then(res => {
            console.log(' Respuesta del servidor:', res.status, res.statusText);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(response => {
            console.log('✅ Datos y selfie enviados exitosamente:', response);
            alert('Datos y selfie enviados correctamente');
            unifiedForm.reset();
        })
        .catch(error => {
            console.error('❌ Error enviando datos y selfie:', error);
            console.error(' Detalles del error:', error.message);
            alert('Error al enviar los datos y selfie: ' + error.message);
        });
    };
    
    reader.readAsDataURL(file);
}

console.log('🔗 Script cargado, botón encontrado:', submitButton);
console.log('🔗 Formulario encontrado:', unifiedForm); 