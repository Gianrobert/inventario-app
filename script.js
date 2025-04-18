

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
  calcularTotal();
});

function agregarProducto(nombre, cantidad, precio) {
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${cantidad}</td>
    <td>$${parseFloat(precio).toFixed(2)}</td>
    <td>
      <button class="editar">Editar</button>
      <button class="borrar">Eliminar</button>
    </td>
  `;

  fila.querySelector('.editar').addEventListener('click', () => {
    editarProducto(fila);
  });

  fila.querySelector('.borrar').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      fila.remove();
      calcularTotal();
    }
  });

  tabla.appendChild(fila);
}

function editarProducto(fila) {
  const celdas = fila.querySelectorAll("td");
  const nombre = celdas[0].textContent;
  const cantidad = celdas[1].textContent;
  const precio = celdas[2].textContent.replace('$', '');

  document.getElementById('nombre').value = nombre;
  document.getElementById('cantidad').value = cantidad;
  document.getElementById('precio').value = precio;

  filaEnEdicion = fila;
}

function actualizarProducto(fila, nombre, cantidad, precio) {
  const celdas = fila.querySelectorAll("td");
  celdas[0].textContent = nombre;
  celdas[1].textContent = cantidad;
  celdas[2].textContent = `$${parseFloat(precio).toFixed(2)}`;
  filaEnEdicion = null;
  calcularTotal();
}

function calcularTotal() {
  let total = 0;
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
    const cantidad = parseInt(fila.children[1]?.textContent);
    const precio = parseFloat(fila.children[2]?.textContent.replace('$', ''));
    if (!isNaN(cantidad) && !isNaN(precio)) {
      total += cantidad * precio;
    }
  });
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}


const buscarInput = document.getElementById("buscar");
buscarInput.addEventListener("input", function () {
  const filtro = buscarInput.value.toLowerCase();
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
    const nombre = fila.children[0]?.textContent.toLowerCase();
    fila.style.display = nombre.includes(filtro) ? "" : "none";
  });
});


const btnLimpiar = document.getElementById("btn-limpiar");
btnLimpiar.addEventListener("click", () => {
  if (confirm("¿Deseas borrar todos los productos?")) {
    tabla.innerHTML = "";
    calcularTotal();
  }
});


