// Estado y claves de almacenamiento
const STORAGE_FIELDS = 'mt_fields_v2';
const STORAGE_ROWS = 'mt_rows_v2';
const MAX_FIELDS = 20;

// Campos: [{ id, name, type: 'text'|'date' }]
let fields = loadFields();
// Filas: [{ id, data: { [fieldId]: value } }]
let rows = loadRows();

// Elementos DOM
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const addFieldBtn = document.getElementById('addFieldBtn');
const addRowBtn = document.getElementById('addRowBtn');
const searchInput = document.getElementById('searchInput');

// Inicialización
renderHeader();
renderTable();

// Eventos
addFieldBtn.addEventListener('click', onAddField);
addRowBtn.addEventListener('click', onAddRow);
searchInput.addEventListener('input', onSearch);

// Delegación en THEAD para renombrar/eliminar campos
tableHeader.addEventListener('click', (e) => {
  const btn = e.target.closest('.delField');
  if (btn) {
    const id = btn.dataset.id;
    if (confirm('¿Eliminar este campo? Los datos de este campo se perderán.')) {
      removeField(id);
    }
  }
});
tableHeader.addEventListener('dblclick', (e) => {
  const label = e.target.closest('.field-label');
  if (!label) return;
  const id = label.dataset.id;
  const f = fields.find(x => x.id === id);
  if (!f) return;
  const newName = prompt('Nuevo nombre del campo:', f.name);
  if (newName && newName.trim()) {
    f.name = newName.trim();
    saveFields();
    renderHeader();
    renderTable();
  }
});

// Delegación en TBODY para cambios en inputs y borrar filas
tableBody.addEventListener('input', (e) => {
  const inp = e.target;
  // Campo dinámico
  if (inp.matches('input[data-field-id]')) {
    const fieldId = inp.dataset.fieldId;
    const tr = inp.closest('tr');
    const rowId = tr.dataset.rowId;
    const row = rows.find(r => r.id === rowId);
    if (row) {
      row.data[fieldId] = sanitizeValue(inp.value, getFieldType(fieldId));
      saveRows();
    }
  }
});
tableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteRow')) {
    const tr = e.target.closest('tr');
    const rowId = tr.dataset.rowId;
    rows = rows.filter(r => r.id !== rowId);
    saveRows();
    renderTable();
  }
});

// Funciones principales
function onAddField() {
  if (fields.length >= MAX_FIELDS) {
    alert(`Máximo de ${MAX_FIELDS} campos alcanzado.`);
    return;
  }
  const name = prompt('Nombre del campo (ej.: Celular, Dirección):');
  if (!name || !name.trim()) return;

  let type = prompt('Tipo de campo: "texto" o "fecha" (por defecto: texto):');
  type = (type || '').trim().toLowerCase();
  if (type !== 'fecha' && type !== 'texto') type = 'texto';

  const field = {
    id: genId('f'),
    name: name.trim(),
    type: type === 'fecha' ? 'date' : 'text',
  };
  fields.push(field);
  saveFields();
  renderHeader();
  renderTable();
}

function removeField(fieldId) {
  fields = fields.filter(f => f.id !== fieldId);
  // Eliminar datos asociados en cada fila
  rows.forEach(r => {
    if (r.data && r.data[fieldId] !== undefined) delete r.data[fieldId];
  });
  saveFields();
  saveRows();
  renderHeader();
  renderTable();
}

function onAddRow() {
  rows.push({ id: genId('r'), data: {} });
  saveRows();
  renderTable();
}

function onSearch() {
  const term = searchInput.value.trim().toLowerCase();
  // Filtrado directo en DOM sobre valores visibles
  Array.from(tableBody.children).forEach(tr => {
    const txt = tr.innerText.toLowerCase();
    tr.style.display = txt.includes(term) ? '' : 'none';
  });
}

function renderHeader() {
  // Reiniciar encabezado: # + campos + Adjuntos + Acciones
  tableHeader.innerHTML = '';
  const thNum = document.createElement('th');
  thNum.className = 'narrow';
  thNum.textContent = '#';
  tableHeader.appendChild(thNum);

  for (const f of fields) {
    const th = document.createElement('th');
    const wrap = document.createElement('span');
    wrap.className = 'field-head';
    const label = document.createElement('span');
    label.className = 'field-label';
    label.dataset.id = f.id;
    label.textContent = `${f.name} ${f.type === 'date' ? '(Fecha)' : ''}`;
    const del = document.createElement('button');
    del.className = 'delField';
    del.dataset.id = f.id;
    del.textContent = '✕';
    wrap.append(label, del);
    th.appendChild(wrap);
    tableHeader.appendChild(th);
  }

  const thAdj = document.createElement('th');
  thAdj.textContent = 'Adjuntos';
  tableHeader.appendChild(thAdj);

  const thAct = document.createElement('th');
  thAct.className = 'narrow';
  thAct.textContent = 'Acciones';
  tableHeader.appendChild(thAct);
}

function renderTable() {
  tableBody.innerHTML = '';
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.rowId = row.id;

    // Número
    const tdNum = document.createElement('td');
    tdNum.className = 'narrow';
    tdNum.textContent = String(idx + 1);
    tr.appendChild(tdNum);

    // Celdas de campos
    for (const f of fields) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.dataset.fieldId = f.id;
      if (f.type === 'date') {
        input.type = 'date';
        input.maxLength = 10; // yyyy-mm-dd
      } else {
        input.type = 'text';
        input.maxLength = 100;
      }
      input.value = row.data?.[f.id] ?? '';
      td.appendChild(input);
      tr.appendChild(td);
    }

    // Adjuntos (no persistentes en esta versión)
    const tdAdj = document.createElement('td');
    tdAdj.className = 'attachments';
    tdAdj.innerHTML = `
      <label class="fileLabel">Foto
        <input type="file" accept="image/*" capture="environment">
      </label>
      <label class="fileLabel">PDF
        <input type="file" accept="application/pdf">
      </label>
    `;
    tr.appendChild(tdAdj);

    // Acciones
    const tdAct = document.createElement('td');
    tdAct.className = 'narrow';
    const delBtn = document.createElement('button');
    delBtn.className = 'deleteRow';
    delBtn.textContent = 'Eliminar';
    tdAct.appendChild(delBtn);
    tr.appendChild(tdAct);

    tableBody.appendChild(tr);
  });
}

function getFieldType(fieldId) {
  return fields.find(f => f.id === fieldId)?.type || 'text';
}

function sanitizeValue(val, type) {
  if (type === 'date') return (val || '').slice(0, 10);
  // Texto alfanumérico hasta 100 chars
  return (val || '').toString().slice(0, 100);
}

// Persistencia
function loadFields() {
  try {
    const raw = localStorage.getItem(STORAGE_FIELDS);
    const arr = raw ? JSON.parse(raw) : [];
    // Validar estructura mínima
    return Array.isArray(arr) ? arr.filter(f => f && f.id && f.name) : [];
  } catch { return []; }
}
function saveFields() {
  localStorage.setItem(STORAGE_FIELDS, JSON.stringify(fields));
}
function loadRows() {
  try {
    const raw = localStorage.getItem(STORAGE_ROWS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(r => r && r.id && r.data) : [];
  } catch { return []; }
}
function saveRows() {
  localStorage.setItem(STORAGE_ROWS, JSON.stringify(rows));
}

// Util
function genId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
