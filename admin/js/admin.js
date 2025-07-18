document.addEventListener('DOMContentLoaded', function() {
    
    // Función para descargar imagen
    function downloadImage(imageUrl, fileName) {
        // Crear un elemento <a> temporal para la descarga
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName || 'usuario_foto.jpg';
        
        // Añadir el link al DOM temporalmente
        document.body.appendChild(link);
        
        // Simular el clic para iniciar la descarga
        link.click();
        
        // Remover el link del DOM
        document.body.removeChild(link);
    }

    // Función para manejar el clic en las fotos de usuario
    function handlePhotoClick(event) {
        const photoElement = event.target.closest('.user-photo');
        if (!photoElement) return;

        // Obtener información de la fila para el nombre del archivo
        const row = photoElement.closest('tr');
        const userId = row.querySelector('td:nth-child(2)').textContent; // ID
        const userName = row.querySelector('td:nth-child(3)').textContent; // Nombre
        
        // Verificar si hay una imagen real o solo es placeholder
        const img = photoElement.querySelector('img');
        if (img && img.src && !img.src.includes('placeholder')) {
            // Si hay una imagen real, descargarla
            const fileName = `${userName.replace(/\s+/g, '_')}_${userId}.jpg`;
            downloadImage(img.src, fileName);
        } else {
            // Si solo es placeholder, mostrar mensaje
            alert(`No hay imagen disponible para ${userName}`);
        }
    }

    // Agregar event listeners a todas las fotos de usuario
    function attachPhotoClickListeners() {
        const userPhotos = document.querySelectorAll('.user-photo');
        
        userPhotos.forEach(photo => {
            // Añadir cursor pointer para indicar que es clickeable
            photo.style.cursor = 'pointer';
            photo.title = 'Haz clic para descargar la imagen';
            
            // Agregar event listener
            photo.addEventListener('click', handlePhotoClick);
        });
    }

    // Función para actualizar la tabla con imágenes reales (cuando se conecte con backend)
    function updateUserPhoto(userId, imageUrl) {
        const rows = document.querySelectorAll('#users-table-body tr');
        
        rows.forEach(row => {
            const idCell = row.querySelector('td:nth-child(2)');
            if (idCell && idCell.textContent === userId) {
                const photoContainer = row.querySelector('.user-photo');
                
                // Remover placeholder
                const placeholder = photoContainer.querySelector('.photo-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
                
                // Crear elemento img
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Foto de usuario';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                
                // Agregar imagen al contenedor
                photoContainer.appendChild(img);
            }
        });
    }

    // Función de ejemplo para simular carga de imágenes (para testing)
 

    // Inicializar funcionalidad
    attachPhotoClickListeners();
    
    // Cargar imágenes de ejemplo (comentar esta línea cuando se conecte con backend real)
    loadSampleImages();
    
    console.log('Admin dashboard inicializado - Funcionalidad de descarga de fotos activada');
});

// Función global para agregar nuevos usuarios dinámicamente (para usar desde backend)
window.addUserToTable = function(userData) {
    const tableBody = document.getElementById('users-table-body');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="user-photo">
                ${userData.photoUrl ? 
                    `<img src="${userData.photoUrl}" alt="Foto de usuario" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                    `<span class="photo-placeholder">📷</span>`
                }
            </div>
        </td>
        <td>${userData.id}</td>
        <td>${userData.nombre}</td>
        <td>${userData.correo}</td>
        <td>${userData.edad}</td>
        <td>${userData.comida}</td>
        <td>${userData.fecha}</td>
    `;
    
    tableBody.appendChild(row);
    
    // Agregar event listener a la nueva foto
    const newPhoto = row.querySelector('.user-photo');
    newPhoto.style.cursor = 'pointer';
    newPhoto.title = 'Haz clic para descargar la imagen';
    newPhoto.addEventListener('click', handlePhotoClick);
};

// Función para cargar usuarios desde el backend
async function loadUsersFromBackend() {
    try {
        const response = await fetch('https://backformulary.onrender.com/api/register');
        const users = await response.json();
        
        // Actualizar la tabla con los datos reales
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="user-photo">
                        <img src="${user.selfie}" alt="Foto de usuario" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                    </div>
                </td>
                <td>${user._id}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.edad}</td>
                <td>${user.comida}</td>
                <td>${new Date(user.fecha).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Actualizar estadísticas
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('unique-emails').textContent = new Set(users.map(u => u.correo)).size;
        
        const today = new Date().toDateString();
        const todayUsers = users.filter(u => new Date(u.fecha).toDateString() === today);
        document.getElementById('today-registrations').textContent = todayUsers.length;
        
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

// Cargar usuarios al inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadUsersFromBackend();
    // ... resto del código existente ...
});
