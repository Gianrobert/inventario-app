const form = document.getElementById('form-producto');
const tabla = document.getElementById('tabla-productos');
const errorMensaje = document.getElementById("error-mensaje");

let filaEnEdicion = null;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const cantidad = document.getElementById('cantidad').value;
  const precio = document.getElementById('precio').value;

  const nombreLimpio = nombre.trim();
  const cantidadNum = parseInt(cantidad);
  const precioNum = parseFloat(precio);

 
  if (!nombreLimpio || isNaN(cantidadNum) || cantidadNum <= 0 || isNaN(precioNum) || precioNum <= 0) {
    errorMensaje.textContent = "Datos inválidos. El nombre no puede estar vacío, y cantidad/precio deben ser mayores que cero.";
    errorMensaje.style.display = "block";
    return;
  }
  
  errorMensaje.style.display = "none";

  if (filaEnEdicion) {
    actualizarProducto(filaEnEdicion, nombreLimpio, cantidadNum, precioNum);
    filaEnEdicion = null;
  } else {
    agregarProducto(nombreLimpio, cantidadNum, precioNum);
  }

  form.reset();
});

function agregarProducto(nombre, cantidad, precio) {
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${cantidad}</td>
    <td>$${parseFloat(precio).toFixed(2)}</td>
    <td><button class="borrar">Eliminar</button></td>
  `;

  fila.querySelector('.borrar').addEventListener('click', () => {
    fila.remove();
  });

  tabla.appendChild(fila);
}

