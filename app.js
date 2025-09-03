// Campos preconfigurados
const fields = [
  // Datos cliente y vehículo
  "Nombre cliente", "RUT", "Teléfono", "Correo", "Dirección",
  "Fecha ingreso", "Marca", "Modelo", "Año", "Patente",
  "N° chasis/VIN", "Kilometraje", "Color", "Combustible", "Transmisión",
  // Trabajo y repuestos
  "Descripción falla", "Diagnóstico", "Trabajos a realizar",
  "Repuestos", "Costo repuestos", "Costo mano de obra",
  "Observaciones", "Fecha entrega", "Estado trabajo",
  // Gestión administrativa
  "N° OT", "Presupuesto total", "Abono", "Saldo pendiente",
  "Forma de pago", "Fecha pago", "Garantía", "Historial servicios", "Notas internas"
];

const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const addRowBtn = document.getElementById('addRowBtn');
const searchInput = document.getElementById('searchInput');

// Render encabezado
function renderHeader() {
  tableHeader.innerHTML = '<th>#</th>';
  fields.forEach(f => {
    const th = document.createElement('th');
    th.textContent = f;
    tableHeader.appendChild(th);
  });
  const thAdj = document.createElement('th');
  thAdj.textContent = 'Adjuntos';
  tableHeader.appendChild(thAdj);
  const thAcc = document.createElement('th');
  thAcc.textContent = 'Acciones';
  tableHeader.appendChild(thAcc);
}

// Render tabla
function renderTable() {
  tableBody.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('tallerData') || '[]');
  data.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx + 1}</td>` +
      fields.map((f, i) => `<td><input type="text" value="${row[i] || ''}"></td>`).join('') +
      `<td><input type="file" accept="image/*,application/pdf"></td>` +
      `<td><button class="deleteBtn">Eliminar</button></td>`;
    tableBody.appendChild(tr);
  });
}

// Guardar datos
function saveTable() {
  const rows = [];
  Array.from(tableBody.rows).forEach(tr => {
    const inputs = tr.querySelectorAll('td input[type="text"]');
    const values = Array.from(inputs).map(inp => inp.value);
    rows.push(values);
  });
  localStorage.setItem('tallerData', JSON.stringify(rows));
}

// Eventos
addRowBtn.addEventListener('click', () => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${tableBody.rows.length + 1}</td>` +
    fields.map(() => `<td><input type="text"></td>`).join('') +
    `<td><input type="file" accept="image/*,application/pdf"></td>` +
    `<td><button class="deleteBtn">Eliminar</button></td>`;
  tableBody.appendChild(tr);
  saveTable();
});

tableBody.addEventListener('input', saveTable);

tableBody.addEventListener('click', e => {
  if (e.target.classList.contains('deleteBtn')) {
    e.target.closest('tr').remove();
    saveTable();
    renderTable();
  }
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  Array.from(tableBody.rows).forEach(row => {
    const match = row.innerText.toLowerCase().includes(term);
    row.style.display = match ? '' : 'none';
  });
});

// Inicializar
renderHeader();
renderTable();
