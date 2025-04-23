// Variables globales
let palabrasEncontradas = [];
let todasLasPalabras = ["wireframe", "prototipo", "navegacion", "boton", "esquema", "interfaz", "usuario", "diseño"];
let palabrasSeleccionadas = [];

// Función para inicializar la sopa de letras
function inicializarSopa() {
    // Ocultar el botón de verificar al inicio
    document.getElementById('verificar-btn').style.display = 'none';
    
    // Inicializar eventos para las celdas de la sopa
    const celdas = document.querySelectorAll('.sopa-letras td');
    let seleccionActual = [];
    let seleccionando = false;
    
    celdas.forEach(celda => {
        celda.addEventListener('mousedown', (e) => {
            seleccionando = true;
            seleccionActual = [celda];
            celda.classList.add('seleccionada');
        });
        
        celda.addEventListener('mouseover', (e) => {
            if (seleccionando) {
                seleccionActual.push(celda);
                celda.classList.add('seleccionada');
            }
        });
        
        celda.addEventListener('mouseup', (e) => {
            seleccionando = false;
            verificarPalabra(seleccionActual);
            seleccionActual.forEach(c => c.classList.remove('seleccionada'));
            seleccionActual = [];
            
            // Verificar si todas las palabras han sido encontradas
            if (palabrasEncontradas.length === todasLasPalabras.length) {
                document.getElementById('verificar-btn').style.display = 'block';
            }
        });
    });
    
    // Evitar que se siga seleccionando si el mouse sale de la sopa
    document.querySelector('.sopa-letras').addEventListener('mouseleave', () => {
        if (seleccionando) {
            seleccionando = false;
            seleccionActual.forEach(c => c.classList.remove('seleccionada'));
            seleccionActual = [];
        }
    });
}

// Función para verificar si la selección forma una palabra válida
function verificarPalabra(celdas) {
    // Obtener la palabra formada por las celdas seleccionadas
    let palabra = celdas.map(celda => celda.textContent.trim().toLowerCase()).join('');
    
    // También verificar en sentido inverso
    let palabraInversa = palabra.split('').reverse().join('');
    
    // Lista de palabras a buscar
    const palabrasBuscar = [
        "wireframe", "prototipo", "navegacion", "boton", 
        "esquema", "interfaz", "usuario", "diseño"
    ];
    
    // Verificar si la palabra está en la lista
    if (palabrasBuscar.includes(palabra.toLowerCase())) {
        marcarPalabraEncontrada(palabra, celdas);
        return true;
    } else if (palabrasBuscar.includes(palabraInversa.toLowerCase())) {
        marcarPalabraEncontrada(palabraInversa, celdas);
        return true;
    }
    
    return false;
}

// Función para marcar una palabra como encontrada
function marcarPalabraEncontrada(palabra, celdas) {
    // Marcar las celdas permanentemente
    celdas.forEach(celda => {
        celda.classList.add('encontrada');
    });
    
    // Tachar la palabra en la lista
    const palabrasItems = document.querySelectorAll('.palabras-buscar a, .palabras-buscar li');
    palabrasItems.forEach(item => {
        if (item.textContent.toLowerCase().trim() === palabra.toLowerCase()) {
            item.classList.add('tachado');
        }
    });
    
    // Mostrar mensaje de éxito
    mostrarMensajeExito(palabra);
    
    // Verificar si todas las palabras han sido encontradas
    verificarTodasEncontradas();
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito(palabra) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alert alert-success';
    mensajeDiv.textContent = `¡Correcto! Encontraste la palabra "${palabra.toUpperCase()}"`;
    
    // Insertar el mensaje en el contenedor
    const contenedor = document.querySelector('.container');
    contenedor.appendChild(mensajeDiv);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

// Función para verificar si todas las palabras han sido encontradas
function verificarTodasEncontradas() {
    const palabrasItems = document.querySelectorAll('.palabras-buscar a, .palabras-buscar li');
    const todasTachadas = Array.from(palabrasItems).every(item => item.classList.contains('tachado'));
    
    if (todasTachadas) {
        // Todas las palabras han sido encontradas
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'alert alert-success';
        mensajeDiv.textContent = '¡Felicidades! Has encontrado todas las palabras.';
        
        const contenedor = document.querySelector('.container');
        contenedor.appendChild(mensajeDiv);
        
        // Ocultar el botón de verificar ya que no es necesario
        const botonVerificar = document.querySelector('#verificar-btn');
        if (botonVerificar) {
            botonVerificar.style.display = 'none';
        }
    }
}

// Función para verificar todas las respuestas
function verificarRespuestas() {
    if (palabrasEncontradas.length === todasLasPalabras.length) {
        alert('¡Felicidades! Has encontrado todas las palabras.');
    } else {
        alert(`Has encontrado ${palabrasEncontradas.length} de ${todasLasPalabras.length} palabras. ¡Sigue buscando!`);
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarSopa);