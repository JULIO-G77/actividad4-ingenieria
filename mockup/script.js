// script.js - Simulación registro de cita con validaciones básicas
const form = document.getElementById('citaForm');
const resultado = document.getElementById('resultado');
const errores = document.getElementById('errores');

// Simulamos una "base de datos" en memoria con horarios ocupados por médico
// Formato: { medicoId: { '2025-10-29': ['09:00', '10:00'], ... } }
const ocupados = {
  dr_arias: { '2025-10-29': ['09:00'] },
  dr_morales: {},
  dr_lopez: {}
};

function limpiarMensajes() {
  resultado.innerHTML = '';
  errores.innerText = '';
}

function validarTelefono(tel) {
  // validar números y longitud mínima 7
  const soloNums = /^\d{7,15}$/;
  return soloNums.test(tel.replace(/\s+/g,''));
}

function horaFormateada(hora) {
  // asegura formato HH:MM
  return hora.length === 5 ? hora : hora;
}

function estaDisponible(medico, fecha, hora) {
  // revisa ocupados simulados
  const fechas = ocupados[medico] || {};
  const horarios = fechas[fecha] || [];
  return horarios.indexOf(hora) === -1;
}

// Al enviar form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  limpiarMensajes();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const medico = document.getElementById('medico').value;
  const fecha = document.getElementById('fecha').value;
  const hora = horaFormateada(document.getElementById('hora').value);
  const observaciones = document.getElementById('observaciones').value.trim();

  // Validaciones
  const erroresList = [];
  if (!nombre) erroresList.push('Ingresa el nombre del paciente.');
  if (!telefono || !validarTelefono(telefono)) erroresList.push('Ingresa un teléfono válido (solo números, mínimo 7 dígitos).');
  if (!fecha) erroresList.push('Selecciona una fecha.');
  if (!hora) erroresList.push('Selecciona una hora.');
  if (fecha && hora) {
    // no permitido fechas en el pasado (comparación simple)
    const hoy = new Date();
    const sel = new Date(fecha + 'T' + hora);
    if (sel < hoy) erroresList.push('La fecha/hora no puede ser en el pasado.');
  }

  if (erroresList.length) {
    errores.innerHTML = erroresList.join('<br>');
    return;
  }

  // Disponibilidad
  if (!estaDisponible(medico, fecha, hora)) {
    errores.innerText = 'El médico NO está disponible en esa fecha/hora. Elige otro horario.';
    return;
  }

  // Simular guardar: agregamos a ocupados (esto simula el backend)
  if (!ocupados[medico]) ocupados[medico] = {};
  if (!ocupados[medico][fecha]) ocupados[medico][fecha] = [];
  ocupados[medico][fecha].push(hora);

  // Mostrar confirmación
const tipoCita = document.getElementById('tipo_cita').value;
// ...
resultado.innerHTML = `
  <strong>Cita registrada correctamente</strong><br>
  <b>Paciente:</b> ${nombre}<br>
  <b>Tel:</b> ${telefono}<br>
  <b>Médico:</b> ${medico.replace('_', ' ')}<br>
  <b>Tipo:</b> ${tipoCita}<br>
  <b>Fecha:</b> ${fecha} <b>Hora:</b> ${hora}<br>
  <b>Observaciones:</b> ${observaciones || 'Ninguna'}
`;


  // Limpiar form parcialmente (opcional)
  form.reset();
});
