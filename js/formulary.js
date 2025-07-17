 const button = document.getElementById('submit1');
 button.addEventListener('click', handleSubmit);
 
 function handleSubmit(e) {
    e.preventDefault(); // Evita recarga si el botón está dentro de un form
    const form = document.getElementById('form');
    const data = {
        nombre: form.nombre.value,
        correo: form.correo.value,
        edad: form.edad.value,
        comida: form.comida.value,
    };
console.log(data);

    fetch('/api/datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(response => {
        console.log('Datos enviados:', response);
        form.reset();
        alert('Datos enviados correctamente');
    })
    .catch(error => {
        console.error('Error enviando datos:', error);
        alert('Error al enviar los datos');
    });
}






