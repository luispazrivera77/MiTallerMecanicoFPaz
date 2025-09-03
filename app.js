// Campos preconfigurados
const fields = [
  // Cliente y vehículo
  { name: "Nombre cliente", type: "text" },
  { name: "RUT", type: "text" },
  { name: "Teléfono", type: "text" },
  { name: "Correo", type: "text" },
  { name: "Dirección", type: "text" },
  { name: "Fecha ingreso", type: "date" },
  { name: "Marca", type: "text" },
  { name: "Modelo", type: "text" },
  { name: "Año", type: "number" },
  { name: "Patente", type: "text" },
  { name: "N° chasis/VIN", type: "text" },
  { name: "Kilometraje", type: "number" },
  { name: "Color", type: "text" },
  { name: "Combustible", type: "text" },
  { name: "Transmisión", type: "text" },
  // Trabajo y repuestos
  { name: "Descripción falla", type: "text" },
  { name: "Diagnóstico", type: "text" },
  { name: "Trabajos a realizar", type: "text" },
  { name: "Repuestos", type: "text" },
  { name: "Costo repuestos", type: "number" },
  { name: "Costo mano de obra", type: "number" },
  { name: "Observaciones", type: "text" },
  { name: "Fecha entrega", type: "date" },
  { name: "Estado trabajo", type: "text" },
  // Gestión administrativa
  { name: "N° OT", type: "text" },
  { name: "Presupuesto total", type: "number" },
  { name: "Abono", type: "number" },
  { name: "Saldo pendiente", type: "number" },
  { name: "Forma de pago", type: "text" },
  { name: "Fecha pago", type: "date" },
  { name: "Garantía", type: "text" },
  { name: "Historial servicios", type: "text" },
  { name: "Notas internas", type: "text" }
];

const addRecordBtn = document.getElementById('addRecordBtn');
const formContainer = document.getElementById('formContainer');
const formFields = document.getElementById('formFields');
const recordForm = document.getElementById('recordForm');
const cancelBtn = document.getElementById('cancelBtn');
const recordsDiv = document.getElementById('records');
const searchInput = document.getElementById('searchInput');

let records = JSON.parse(localStorage.getItem('tallerRecords') || '[]');
let editIndex = null;

function renderForm() {
  formFields.innerHTML = '';
  fields.forEach(f => {
    const label = document.createElement('label');
    label.textContent = f.name;
    const input = document.createElement('input');
    input.type = f.type;
    input.name = f.name;
    formFields.appendChild(label);
    formFields.appendChild(input);
  });
}

function renderRecords() {
  recordsDiv.innerHTML = '';
  records.forEach((rec, idx) => {
    const card = document.createElement('div');
    card.className = 'record-card';
    card.innerHTML = `<h3>Registro #${idx + 1}</h3>` +
      fields.map(f => `<p><strong>${f.name}:</strong> ${rec[f.name] || ''}</p>`).join('') +
      `<button onclick="editRecord(${idx})">Editar</button>
       <button onclick="deleteRecord(${idx})">Eliminar</button>`;
    recordsDiv.appendChild(card);
  });
}

function saveRecords() {
  localStorage.setItem('tallerRecords', JSON.stringify(records));
}

addRecordBtn.addEventListener('click', () => {
  editIndex = null;
  recordForm.reset();
  formContainer.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  formContainer.classList.add('hidden');
});

recordForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(recordForm);
  const record = {};
  fields.forEach(f => {
    record[f.name] = formData.get(f.name);
  });
  if (editIndex !== null) {
    records[editIndex] = record;
  } else {
    records.push(record);
  }
  saveRecords();
  renderRecords();
  formContainer.classList.add('hidden');
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  Array.from(recordsDiv.children).forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(term) ? '' : 'none';
  });
});

window.editRecord = function(idx) {
  editIndex = idx;
  renderForm();
  const rec = records[idx];
  fields.forEach(f => {
    recordForm.querySelector(`[name="${f.name}"]`).value
