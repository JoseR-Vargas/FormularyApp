// Unified form handler for both data and selfie
const submitButton = document.getElementById('submitButton');
const unifiedForm = document.getElementById('unifiedForm');

submitButton.addEventListener('click', handleUnifiedSubmit);

// Función mejorada para comprimir imagen
function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.6) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular nuevas dimensiones manteniendo proporción
            let { width, height } = img;
            
            // Reducir dimensiones si son muy grandes
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }
            
            // Para iPhone, reducir aún más si es necesario
            if (width > 400 || height > 400) {
                const ratio = Math.min(400 / width, 400 / height);
                width = width * ratio;
                height = height * ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Aplicar filtros para mejorar la compresión
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Dibujar imagen comprimida
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a base64 con calidad reducida
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            
            
            resolve(compressedBase64);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Función para detectar el tipo de dispositivo
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function handleUnifiedSubmit(e) {
    e.preventDefault();
    console.log('🚀 Función handleUnifiedSubmit ejecutada');
    
    // Validar reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        alert("Por favor completá el reCAPTCHA.");
        return;
    }
    
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


    // Validate form data
    if (!formData.nombre || !formData.correo || !formData.edad || !formData.comida) {
        alert("Por favor completá todos los campos.");
        return;
    }

    // Configurar compresión según el dispositivo
    const isMobile = isMobileDevice();
    const maxWidth = isMobile ? 400 : 600;
    const maxHeight = isMobile ? 400 : 600;
    const quality = isMobile ? 0.5 : 0.6;

    console.log('📱 Dispositivo móvil:', isMobile);
    console.log('⚙️ Configuración:', { maxWidth, maxHeight, quality });

    // Comprimir imagen antes de enviar
    compressImage(file, maxWidth, maxHeight, quality)
    .then(compressedBase64 => {
        console.log('️ Imagen comprimida, longitud:', compressedBase64.length);
        
        // Verificar que la imagen no sea demasiado grande
        if (compressedBase64.length > 500000) { // 500KB
            alert('Por favor, intenta con una imagen más pequeña.');
            return;
        }
        
        // Combine form data with compressed selfie and reCAPTCHA
        const completeData = {
            ...formData,
            selfie: compressedBase64,
            recaptchaResponse: recaptchaResponse
        };

        console.log('📤 Enviando datos al backend...');

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
            console.log('Datos y selfie enviados exitosamente:', response);
            alert('Datos y selfie enviados correctamente');
            unifiedForm.reset();
            // Reset reCAPTCHA after successful submission
            grecaptcha.reset();
        })
        .catch(error => {
            console.error(' Detalles del error:', error.message);
            alert('Error al enviar los datos y selfie: ' + error.message);
        });
    })
    .catch(error => {
        console.error(' Error comprimiendo imagen:', error);
        alert('Error procesando la imagen');
    });
}
