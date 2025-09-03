// ===== Campos preconfigurados (agrupados por secciones) =====
const FIELD_DEFS = [
  { key: "nombreCliente", label: "Nombre cliente", type: "text", section: "Cliente y vehículo" },
  { key: "rut", label: "RUT", type: "text", section: "Cliente y vehículo" },
  { key: "telefono", label: "Teléfono", type: "text", section: "Cliente y vehículo" },
  { key: "correo", label: "Correo", type: "text", section: "Cliente y vehículo" },
  { key: "direccion", label: "Dirección", type: "text", section: "Cliente y vehículo" },
  { key: "fechaIngreso", label: "Fecha ingreso", type: "date", section: "Cliente y vehículo" },
  { key: "marca", label: "Marca", type: "text", section: "Cliente y vehículo" },
  { key: "modelo", label: "Modelo", type: "text", section: "Cliente y vehículo" },
  { key: "anio", label: "Año", type: "number", section: "Cliente y vehículo" },
  { key: "patente", label: "Patente", type: "text", section: "Cliente y vehículo" },
  { key: "vin", label: "N° chasis/VIN", type: "text", section: "Cliente y vehículo" },
  { key: "kilometraje", label: "Kilometraje", type: "number", section: "Cliente y vehículo" },
  { key: "color", label: "Color", type: "text", section: "Cliente y vehículo" },
  { key: "combustible", label: "Combustible", type: "text", section: "Cliente y vehículo" },
  { key: "transmision", label: "Transmisión", type: "text", section: "Cliente y vehículo" },

  { key: "descripcionFalla", label: "Descripción falla", type: "text", section: "Trabajo y repuestos" },
  { key: "diagnostico", label: "Diagnóstico", type: "text", section: "Trabajo y repuestos" },
  { key: "trabajos", label: "Trabajos a realizar", type: "text", section: "Trabajo y repuestos" },
  { key: "repuestos", label: "Repuestos", type: "text", section: "Trabajo y repuestos" },
  { key: "costoRepuestos", label: "Costo repuestos", type: "number", section: "Trabajo y repuestos" },
  { key: "costoManoObra", label: "Costo mano de obra", type: "number", section: "Trabajo y repuestos" },
  { key: "observaciones", label: "Observaciones", type: "text", section: "Trabajo y repuestos" },
  { key: "fechaEntrega", label: "Fecha entrega", type: "date", section: "Trabajo y repuestos" },
  { key: "estadoTrabajo", label: "Estado trabajo", type: "text", section: "Trabajo y repuestos" },

  { key: "numeroOT", label: "N° OT", type: "text", section: "Gestión administrativa" },
  { key: "presupuestoTotal", label: "Presupuesto total", type: "number", section: "Gestión administrativa" },
  { key: "abono", label: "Abono", type: "number", section: "Gestión administrativa" },
  { key: "saldoPendiente", label: "Saldo pendiente", type: "number", section: "Gestión administrativa" },
  { key: "formaPago", label: "Forma de pago", type: "text", section: "Gestión administrativa" },
  { key: "fechaPago", label: "Fecha pago", type: "date", section: "Gestión administrativa" },
  { key: "garantia", label: "Garantía", type: "text", section: "Gestión administrativa" },
  { key: "historialServicios", label: "Historial servicios", type: "text", section: "Gestión administrativa" },
  { key: "notasInternas", label: "Notas internas", type: "text", section: "Gestión administrativa" },
];

const MAX_TEXT = 100;

// ===== IndexedDB wrapper =====
const idb = (() => {
  let db;
  const open = () => new Promise((res, rej) => {
    const req = indexedDB.open("tallerDB_v1", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("records")) {
        db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => { db = req.result; res(db); };
    req.onerror = () => rej(req.error);
  });

  const tx = (stores, mode = "readonly") => db.transaction(stores, mode);
  const add = (store, val) => new Promise((res, rej) => {
    const req = tx([store], "readwrite").objectStore(store).add(val);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  const put = (store, val) => new Promise((res, rej) => {
    const req = tx([store], "readwrite").objectStore(store).put(val);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  const get = (store, key) => new Promise((res, rej) => {
    const req = tx([store]).objectStore(store).get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  const del = (store, key) => new Promise((res, rej) => {
    const req = tx([store], "readwrite").objectStore(store).delete(key);
    req.onsuccess = () => res(true);
    req.onerror = () => rej(req.error);
  });
  const getAll = (store) => new Promise((res, rej) => {
    const req = tx([store]).objectStore(store).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });

  return { open, add, put, get, del, getAll };
})();

// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const el = (t, props = {}, ...children) => {
  const n = document.createElement(t);
  Object.assign(n, props);
  for (const c of children) n.append(c);
  return n;
};

function sanitize(name, type, value) {
  if (type === "date") return (value || "").slice(0, 10);
  if (type === "number") return value === "" ? "" : String(value).slice(0, MAX_TEXT);
  return String(value || "").slice(0, MAX_TEXT);
}

// ===== State =====
let state = {
  records: [],
  editId: null,
};

// ===== UI refs =====
const addRecordBtn = $("#addRecordBtn");
const formContainer = $("#formContainer");
const formFields = $("#formFields");
const recordForm = $("#recordForm");
const cancelBtn = $("#cancelBtn");
const recordsDiv = $("#records");
const emptyState = $("#emptyState");
const countBadge = $("#countBadge");
const formTitle = $("#formTitle");
const recordIdInput = $("#recordId");
const photoInput = $("#photoInput");
const pdfInput = $("#pdfInput");
const photoPreview = $("#photoPreview");
const pdfPreview = $("#pdfPreview");
const searchInput = $("#searchInput");

// ===== Init =====
(async function init() {
  await idb.open();
  await loadRecords();
  buildFormFields();
  bindEvents();
  renderRecords();
})();

function bindEvents() {
  addRecordBtn.addEventListener("click", () => openForm());
  cancelBtn.addEventListener("click", () => closeForm());
  recordForm.addEventListener("submit", onSubmitForm);
  searchInput.addEventListener("input", onSearch);
  photoInput.addEventListener("change", updateFilePreview);
  pdfInput.addEventListener("change", updateFilePreview);
}

async function loadRecords() {
  state.records = await idb.getAll("records");
  // Orden por fecha de actualización descendente
  state.records.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
}

function buildFormFields(record = null) {
  formFields.innerHTML = "";
  let currentSection = "";
  FIELD_DEFS.forEach(def => {
    if (def.section !== currentSection) {
      currentSection = def.section;
      const sec = el("div", { className: "form-section" }, el("h3", { textContent: currentSection }));
      formFields.append(sec);
    }
    const wrapper = el("div");
    const label = el("label", { textContent: def.label });
    const input = el("input", { type: def.type, name: def.key });
    if (def.type === "text") input.maxLength = MAX_TEXT;
    wrapper.append(label, input);

    formFields.lastElementChild.append(wrapper);
  });
}

function fillFormValues(record) {
  FIELD_DEFS.forEach(def => {
    const input = recordForm.querySelector(`[name="${def.key}"]`);
    const v = record?.data?.[def.key] ?? "";
    input.value = sanitize(def.key, def.type, v);
  });
  // Previews (solo indicativos)
  photoPreview.textContent = record?.photoId ? "Foto guardada." : "";
  pdfPreview.textContent = record?.pdfId ? "PDF guardado." : "";
  photoInput.value = "";
  pdfInput.value = "";
}

function openForm(record = null) {
  state.editId = record?.id ?? null;
  formTitle.textContent = state.editId ? "Editar registro" : "Nuevo registro";
  recordIdInput.value = state.editId || "";
  buildFormFields();
  fillFormValues(record);
  formContainer.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeForm() {
  recordForm.reset();
  formContainer.classList.add("hidden");
  state.editId = null;
  photoPreview.textContent = "";
  pdfPreview.textContent = "";
}

async function onSubmitForm(e) {
  e.preventDefault();
  // Construir objeto data
  const formData = new FormData(recordForm);
  const data = {};
  FIELD_DEFS.forEach(def => {
    data[def.key] = sanitize(def.key, def.type, formData.get(def.key));
  });

  // Manejo de adjuntos
  let photoId = null;
  let pdfId = null;

  const editing = Boolean(state.editId);
  if (editing) {
    const existing = state.records.find(r => r.id === state.editId);
    photoId = existing?.photoId ?? null;
    pdfId = existing?.pdfId ?? null;
  }

  // Si hay archivos nuevos, guardarlos
  const photoFile = photoInput.files[0] || null;
  const pdfFile = pdfInput.files[0] || null;

  if (photoFile) photoId = await idb.add("files", { blob: photoFile, name: photoFile.name, type: photoFile.type, ts: Date.now() });
  if (pdfFile) pdfId = await idb.add("files", { blob: pdfFile, name: pdfFile.name, type: pdfFile.type, ts: Date.now() });

  const now = Date.now();

  if (editing) {
    const rec = state.records.find(r => r.id === state.editId);
    rec.data = data;
    rec.photoId = photoId;
    rec.pdfId = pdfId;
    rec.updatedAt = now;
    await idb.put("records", rec);
  } else {
    const newRec = { data, photoId, pdfId, createdAt: now, updatedAt: now };
    const id = await idb.add("records", newRec);
    newRec.id = id;
    state.records.unshift(newRec);
  }

  await loadRecords();
  renderRecords();
  closeForm();
}

function onSearch() {
  const q = (searchInput.value || "").toLowerCase();
  Array.from(recordsDiv.children).forEach(card => {
    const show = card.innerText.toLowerCase().includes(q);
    card.style.display = show ? "" : "none";
  });
}

function updateFilePreview() {
  photoPreview.textContent = photoInput.files[0]?.name || (photoPreview.textContent || "");
  pdfPreview.textContent = pdfInput.files[0]?.name || (pdfPreview.textContent || "");
}

function detailItem(label, value) {
  const d = el("div", { className: "detail" });
  d.append(el("span", { className: "k", textContent: label }), el("div", { className: "v", textContent: value || "" }));
  return d;
}

function key(rec, k) {
  return rec?.data?.[k] ?? "";
}

function summarize(rec) {
  // Título: N° OT — Cliente — Patente — Estado
  const ot = key(rec, "numeroOT");
  const nombre = key(rec, "nombreCliente");
  const pat = key(rec, "patente");
  const est = key(rec, "estadoTrabajo");
  const parts = [ot && `OT ${ot}`, nombre, pat, est].filter(Boolean);
  return parts.join(" — ") || `Registro #${rec.id}`;
}

async function renderRecords() {
  recordsDiv.innerHTML = "";
  emptyState.classList.toggle("hidden", state.records.length > 0);
  countBadge.textContent = String(state.records.length);

  const tpl = $("#recordCardTpl");

  for (const rec of state.records) {
    const card = tpl.content.firstElementChild.cloneNode(true);
    card.dataset.id = rec.id;
    card.querySelector(".title").textContent = summarize(rec);

    const details = card.querySelector(".details");
    FIELD_DEFS.forEach(def => {
      details.append(detailItem(def.label, rec.data?.[def.key] || ""));
    });

    // Adjuntos
    const photoBtn = card.querySelector(".photo");
    const pdfBtn = card.querySelector(".pdf");

    if (rec.photoId) {
      const file = await idb.get("files", rec.photoId);
      if (file?.blob) {
        const url = URL.createObjectURL(file.blob);
        photoBtn.classList.remove("hidden");
        photoBtn.href = url;
        // Revocar URL tras salir de la página (se limpia cuando recargas)
      }
    }
    if (rec.pdfId) {
      const file = await idb.get("files", rec.pdfId);
      if (file?.blob) {
        const url = URL.createObjectURL(file.blob);
        pdfBtn.classList.remove("hidden");
        pdfBtn.href = url;
      }
    }

    // Acciones
    card.querySelector(".edit").addEventListener("click", () => openForm(rec));
    card.querySelector(".delete").addEventListener("click", async () => {
      if (!confirm("¿Eliminar este registro?")) return;
      await idb.del("records", rec.id);
      state.records = state.records.filter(r => r.id !== rec.id);
      renderRecords();
    });

    recordsDiv.append(card);
  }
}

