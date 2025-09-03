const fields = [
  { key: "nombreCliente", label: "Nombre cliente", type: "text" },
  { key: "fechaIngreso", label: "Fecha ingreso", type: "date" },
  { key: "kilometraje", label: "Kilometraje", type: "number" },
  { key: "presupuestoTotal", label: "Presupuesto total", type: "number" },
  { key: "rut", label: "RUT", type: "text" },
  { key: "telefono", label: "Teléfono", type: "text" },
  { key: "correo", label: "Correo", type: "text" },
  { key: "direccion", label: "Dirección", type: "text" },
  { key: "marca", label: "Marca", type: "text" },
  { key: "modelo", label: "Modelo", type: "text" },
  { key: "anio", label: "Año", type: "number" },
  { key: "patente", label: "Patente", type: "text" },
  { key: "vin", label: "N° chasis/VIN", type: "text" },
  { key: "color", label: "Color", type: "text" },
  { key: "combustible", label: "Combustible", type: "text" },
  { key: "transmision", label: "Transmisión", type: "text" },
  { key: "descripcionFalla", label: "Descripción falla", type: "text" },
  { key: "diagnostico", label: "Diagnóstico", type: "text" },
  { key: "trabajos", label: "Trabajos a realizar", type: "text" },
  { key: "repuestos", label: "Repuestos", type: "text" },
  { key: "costoRepuestos", label: "Costo repuestos", type: "number" },
  { key: "costoManoObra", label: "Costo mano de obra", type: "number" },
  { key: "observaciones", label: "Observaciones", type: "text" },
  { key: "fechaEntrega", label: "Fecha entrega", type: "date" },
  { key: "estadoTrabajo", label: "Estado trabajo", type: "text" },
  { key: "numeroOT", label: "N° OT", type: "text" },
  { key: "abono", label: "Abono", type: "number" },
  { key: "saldoPendiente", label: "Saldo pendiente", type: "number" },
  { key: "formaPago", label: "Forma de pago", type: "text" },
  { key: "fechaPago", label: "Fecha pago", type: "date" },
  { key: "garantia", label: "Garantía", type: "text" },
  { key: "historialServicios", label: "Historial servicios", type: "text" },
  { key: "notasInternas", label: "Notas internas", type: "text" }
];

let records = JSON.parse(localStorage.getItem("tallerRecords") || "[]");

const addRecordBtn = document.getElementBy
