document.addEventListener('DOMContentLoaded', function() {
    
    // Función para cargar usuarios desde el backend
    async function loadUsersFromBackend() {
        try {
            console.log('🔄 Cargando usuarios desde el backend...');
            const response = await fetch('https://backformulary.onrender.com/api/register');
            const users = await response.json();
            
            console.log('✅ Usuarios cargados:', users);
            
            // Actualizar la tabla con los datos reales
            const tableBody = document.getElementById('users-table-body');
            tableBody.innerHTML = '';
            
            if (users.length === 0) {
                // Mostrar mensaje si no hay usuarios
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem; color: #FFD700;">
                            No hay usuarios registrados aún
                        </td>
                    </tr>
                `;
            } else {
                // Renderizar usuarios de la base de datos
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="user-photo" style="cursor: pointer;" title="Haz clic para descargar la imagen">
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
                    
                    // Agregar event listener a la foto recién creada
                    const photoElement = row.querySelector('.user-photo');
                    photoElement.addEventListener('click', () => handlePhotoClick(user));
                });
            }
            
            // Actualizar estadísticas
            document.getElementById('total-users').textContent = users.length;
            document.getElementById('unique-emails').textContent = new Set(users.map(u => u.correo)).size;
            
            const today = new Date().toDateString();
            const todayUsers = users.filter(u => new Date(u.fecha).toDateString() === today);
            document.getElementById('today-registrations').textContent = todayUsers.length;
            
        } catch (error) {
            console.error('❌ Error cargando usuarios:', error);
            // Mostrar mensaje de error en la tabla
            const tableBody = document.getElementById('users-table-body');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #ff6b6b;">
                        Error cargando usuarios: ${error.message}
                    </td>
                </tr>
            `;
        }
    }

    // Función para descargar imagen
    function downloadImage(imageUrl, fileName) {
        console.log(' Descargando imagen:', fileName);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName || 'usuario_foto.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Función para manejar el clic en las fotos de usuario
    function handlePhotoClick(user) {
        console.log('🖱️ Clic en foto de usuario:', user.nombre);
        
        if (user.selfie && user.selfie.length > 0) {
            const fileName = `${user.nombre.replace(/\s+/g, '_')}_${user._id}.jpg`;
            downloadImage(user.selfie, fileName);
        } else {
            alert(`No hay imagen disponible para ${user.nombre}`);
        }
    }

    // Inicializar funcionalidad
    loadUsersFromBackend();
    
    console.log('🔗 Admin dashboard inicializado - Conectado al backend');
});

// Función global para agregar nuevos usuarios dinámicamente
window.addUserToTable = function(userData) {
    const tableBody = document.getElementById('users-table-body');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="user-photo" style="cursor: pointer;" title="Haz clic para descargar la imagen">
                ${userData.photoUrl ? 
                    `<img src="${userData.photoUrl}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
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
    newPhoto.addEventListener('click', () => handlePhotoClick(userData));
};
