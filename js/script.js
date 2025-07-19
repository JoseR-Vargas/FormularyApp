// Unified form handler for both data and selfie
const submitButton = document.getElementById('submitButton');
const unifiedForm = document.getElementById('unifiedForm');

submitButton.addEventListener('click', handleUnifiedSubmit);

// Función para comprimir imagen
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular nuevas dimensiones manteniendo proporción
            let { width, height } = img;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen comprimida
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a base64 con calidad reducida
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

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

    console.log('📸 Archivo seleccionado:', file.name, 'Tamaño:', file.size, 'bytes');

    // Validate form data
    if (!formData.nombre || !formData.correo || !formData.edad || !formData.comida) {
        alert("Por favor completá todos los campos.");
        return;
    }

    console.log('✅ Validación pasada, comprimiendo imagen...');

    // Comprimir imagen antes de enviar
    compressImage(file)
    .then(compressedBase64 => {
        console.log('️ Imagen comprimida, longitud:', compressedBase64.length);
        
        // Combine form data with compressed selfie
        const completeData = {
            ...formData,
            selfie: compressedBase64
        };

        console.log('📤 Enviando datos al backend...');
        console.log(' URL del backend:', 'https://backformulary.onrender.com/api/register');

        // Send both data and selfie to backend
        console.log(' Iniciando fetch...');
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
    })
    .catch(error => {
        console.error('❌ Error comprimiendo imagen:', error);
        alert('Error procesando la imagen');
    });
}

console.log('🔗 Script cargado, botón encontrado:', submitButton);
console.log('🔗 Formulario encontrado:', unifiedForm); 