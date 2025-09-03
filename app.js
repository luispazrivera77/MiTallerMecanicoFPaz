const maxFields = 20;
let fields = JSON.parse(localStorage.getItem('fields')) || [];

const addFieldBtn = document.getElementById('addFieldBtn');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const addRowBtn = document.getElementById('addRowBtn');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');

renderHeader();
loadTable();

addFieldBtn.addEventListener('click', () => {
  if (fields.length >= maxFields) {
    alert(`Máximo ${maxFields} campos alcanzado`);
    return;
  }
  const fieldName = prompt('Nombre del campo:');
  if (fieldName) {
    fields.push(fieldName);
    localStorage.setItem('fields', JSON.stringify(fields));
    renderHeader();
    saveTable();
  }
});

function renderHeader() {
  tableHeader.innerHTML = '<th>#</th>';
  fields.forEach(f => {
    const th = document.createElement('th');
    th.textContent = f;
    tableHeader.appendChild(th);
  });
  const thFiles = document.createElement('th');
  thFiles.textContent = 'Adjuntos';
  tableHeader.appendChild(thFiles);
  const thActions = document.createElement('th');
  thActions.textContent = 'Acciones';
  tableHeader.appendChild(thActions);
}

addRowBtn.addEventListener('click', () => {
  const rowIndex = tableBody.children.length + 1;
  const row = document.createElement('tr');
  row.innerHTML = `<td>${rowIndex}</td>` +
    fields.map(() => `<td><input type="text" maxlength="100"></td>`).join('') +
    `<td><input type="file" accept="image/*,application/pdf"></td>` +
    `<td>
      <button class="editBtn">Editar</button>
      <button class="deleteBtn">Eliminar</button>
    </td>`;
  tableBody.appendChild(row);
  saveTable();
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  Array.from(tableBody.rows).forEach(row => {
    const match = Array.from(row.cells).some(cell =>
      cell.textContent.toLowerCase().includes(term)
    );
    row.style.display = match ? '' : 'none';
  });
});

tableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteBtn')) {
    e.target.closest('tr').remove();
    renumberRows();
    saveTable();
  }
});

function renumberRows() {
  Array.from(tableBody.rows).forEach((row, i) => {
    row.cells[0].textContent = i + 1;
  });
}

function saveTable() {
  const data = [];
  Array.from(tableBody.rows).forEach(row => {
    const rowData = [];
    for (let i = 1; i <= fields.length; i++) {
      rowData.push(row.cells[i].querySelector('input')?.value || '');
    }
    data.push(rowData);
  });
  localStorage.setItem('tableData', JSON.stringify(data));
}

function loadTable() {
  const data = JSON.parse(localStorage.getItem('tableData')) || [];
  data.forEach((rowData, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${idx + 1}</td>` +
      rowData.map(val => `<td><input type="text" maxlength="100" value="${val}"></td>`).join('') +
      `<td><input type="file" accept="image/*,application/pdf"></td>` +
      `<td>
        <button class="editBtn">Editar</button>
        <button class="deleteBtn">Eliminar</button>
      </td>`;
    tableBody.appendChild(row);
  });
}

exportBtn.addEventListener('click', () => {
  let csv = ['#,' + fields.join(',') + ',Adjuntos'];
  Array.from(tableBody.rows).forEach(row => {
    const values = [];
    for (let i = 0; i <= fields.length; i++) {
      values.push(row.cells[i].querySelector('input')?.value || row.cells[i].textContent);
    }
    csv.push(values.join(','));
  });
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi_taller_mecanico.csv';
  a.click();
  URL.revokeObjectURL(url);
});