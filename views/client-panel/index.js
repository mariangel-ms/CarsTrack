const vehiculoNombre = document.getElementById("vehiculo-nombre");
const vehiculoPlaca = document.getElementById("vehiculo-placa");
const vehiculoPropietario = document.getElementById("vehiculo-propietario");
const vehiculoMarca = document.getElementById("vehiculo-marca");
const vehiculoModelo = document.getElementById("vehiculo-modelo");

const faseTitulo = document.getElementById("fase-titulo");
const faseDescripcion = document.getElementById("fase-descripcion");
const faseBadge = document.getElementById("fase-badge");
const faseContenido = document.getElementById("fase-contenido");

// Convierte una fecha  a "26/07/2026"
const formatearFecha = (fecha) => {
  if (!fecha) return "No especificada";
  const soloFecha = fecha.split("T")[0]; // "2026-07-26"
  const partes = soloFecha.split("-"); // ["2026", "07", "26"]
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const pintarRecibido = (orden) => {
  const r = orden.recepcion || {};
  faseContenido.innerHTML = `
    <div class="fase-detalle">
      <div class="dato-fase">
        <span>Fecha de recepción</span>
        <strong>${formatearFecha(r.fecha)}</strong>
      </div>
      <div class="dato-fase">
        <span>Kilometraje</span>
        <strong>${r.kilometraje || 0} km</strong>
      </div>
      <div class="dato-fase">
        <span>Nivel de combustible</span>
        <strong>${r.nivel_combustible || "No especificado"}</strong>
      </div>
      <div class="dato-fase dato-fase-completo">
        <span>Estado general</span>
        <strong>${r.estado_general || "Sin observaciones"}</strong>
      </div>
    </div>
  `;
};

const pintarDiagnostico = (orden) => {
  const d = orden.diagnostico || {};
  faseContenido.innerHTML = `
    <div class="fase-detalle">
      <div class="dato-fase dato-fase-completo">
        <span>Problema reportado</span>
        <strong>${d.problema_reportado || "No especificado"}</strong>
      </div>
      <div class="dato-fase dato-fase-completo">
        <span>Diagnóstico realizado</span>
        <strong>${d.diagnostico_realizado || "Aún en proceso"}</strong>
      </div>
      <div class="dato-fase">
        <span>Fecha del diagnóstico</span>
        <strong>${formatearFecha(d.fecha)}</strong>
      </div>
    </div>
  `;
};

const pintarPresupuesto = (orden) => {
  const repuestos = orden.repuestos || [];

  let filasRepuestos = "";
  for (let i = 0; i < repuestos.length; i++) {
    const r = repuestos[i];
    const totalFila = r.cantidad * r.precio;
    filasRepuestos += `
      <div class="fila-repuesto-cliente">
        <span>${r.nombre}</span>
        <span>${r.cantidad}</span>
        <span>$${r.precio}</span>
        <span>$${totalFila.toFixed(2)}</span>
      </div>
    `;
  }

  if (repuestos.length === 0) {
    filasRepuestos = `<p class="sin-repuestos">Aún no se han agregado repuestos.</p>`;
  }

  const textoAprobacion = {
    pendiente: "Pendiente de tu aprobación",
    aprobado: "Aprobado por ti",
    rechazado: "Rechazado",
  };

  faseContenido.innerHTML = `
    <div class="lista-repuestos-cliente">
      ${filasRepuestos}
    </div>
    <div class="fase-detalle">
      <div class="dato-fase">
        <span>Mano de obra</span>
        <strong>$${Number(orden.mano_obra || 0).toFixed(2)}</strong>
      </div>
      <div class="dato-fase">
        <span>Total estimado</span>
        <strong>$${Number(orden.costo_total || 0).toFixed(2)}</strong>
      </div>
      <div class="dato-fase dato-fase-completo">
        <span>Estado del presupuesto</span>
        <strong>${textoAprobacion[orden.aprobacion_reparacion] || "Pendiente"}</strong>
      </div>
    </div>
  `;
};

const pintarReparacion = (orden) => {
  const reparaciones = orden.reparaciones || [];

  let filas = "";
  for (let i = 0; i < reparaciones.length; i++) {
    const rep = reparaciones[i];
    const estadoTexto = rep.estado === "lista" ? "Lista" : "Pendiente";
    filas += `
      <div class="fila-reparacion-cliente">
        <span>${rep.descripcion}</span>
        <span class="badge-estado-cliente badge-${rep.estado}">${estadoTexto}</span>
      </div>
    `;
  }

  if (reparaciones.length === 0) {
    filas = `<p class="sin-repuestos">Aún no se han registrado reparaciones.</p>`;
  }

  faseContenido.innerHTML = `<div class="lista-reparaciones-cliente">${filas}</div>`;
};

const pintarPruebas = (orden) => {
  const p = orden.pruebas || {};
  const resultadoTexto = {
    aprobado: "Aprobado, listo para entrega",
    revision: "Requiere revisión adicional",
  };

  faseContenido.innerHTML = `
    <div class="fase-detalle">
      <div class="dato-fase dato-fase-completo">
        <span>Observaciones</span>
        <strong>${p.observaciones || "Sin observaciones"}</strong>
      </div>
      <div class="dato-fase dato-fase-completo">
        <span>Resultado</span>
        <strong>${resultadoTexto[p.resultado] || "Pendiente de revisión"}</strong>
      </div>
    </div>
  `;
};

const pintarListoEntrega = (orden) => {
  const l = orden.listo_entrega || {};
  faseContenido.innerHTML = `
    <div class="fase-detalle">
      <div class="dato-fase">
        <span>Fecha estimada de retiro</span>
        <strong>${formatearFecha(l.fecha_estimada_retiro)}</strong>
      </div>
      <div class="dato-fase dato-fase-completo">
        <span>Notas</span>
        <strong>${l.notas || "Sin notas adicionales"}</strong>
      </div>
    </div>
  `;
};

const pintarEntregado = (orden) => {
  const e = orden.entregado || {};
  faseContenido.innerHTML = `
    <div class="fase-detalle">
      <div class="dato-fase dato-fase-completo">
        <span>Fecha de entrega</span>
        <strong>${formatearFecha(e.fecha_retirado)}</strong>
      </div>
    </div>
    <p class="mensaje-entregado">¡Tu vehículo ya fue entregado! Gracias por confiar en nosotros.</p>
  `;
};

const pintarSegunFase = (orden) => {
  const estado = (orden.estado || "").toLowerCase();

  faseBadge.textContent = orden.estado || "Sin estado";

  if (estado.includes("recibido")) {
    faseTitulo.textContent = "Vehículo recibido";
    faseDescripcion.textContent = "Registramos las condiciones de tu vehículo al ingresar al taller.";
    pintarRecibido(orden);
  } else if (estado.includes("diagnos")) {
    faseTitulo.textContent = "En diagnóstico";
    faseDescripcion.textContent = "Estamos revisando tu vehículo para identificar las fallas.";
    pintarDiagnostico(orden);
  } else if (estado.includes("aprobac") || estado.includes("presupuesto")) {
    faseTitulo.textContent = "Presupuesto";
    faseDescripcion.textContent = "Revisa los repuestos y el costo estimado de la reparación.";
    pintarPresupuesto(orden);
  } else if (estado.includes("reparac")) {
    faseTitulo.textContent = "En reparación";
    faseDescripcion.textContent = "El mecánico está trabajando en las reparaciones acordadas.";
    pintarReparacion(orden);
  } else if (estado.includes("prueba")) {
    faseTitulo.textContent = "Pruebas finales";
    faseDescripcion.textContent = "Estamos verificando que todo funcione correctamente.";
    pintarPruebas(orden);
  } else if (estado.includes("listo") || estado.includes("finalizado")) {
    faseTitulo.textContent = "Listo para entrega";
    faseDescripcion.textContent = "Tu vehículo está listo, coordina la fecha de retiro.";
    pintarListoEntrega(orden);
  } else if (estado.includes("entregado")) {
    faseTitulo.textContent = "Entregado";
    faseDescripcion.textContent = "El servicio ha finalizado.";
    pintarEntregado(orden);
  } else {
    faseTitulo.textContent = orden.estado || "Estado desconocido";
    faseDescripcion.textContent = "";
    faseContenido.innerHTML = `<p class="sin-repuestos">No hay información adicional para esta fase.</p>`;
  }
};

const cargarMiOrden = async () => {
  try {
    const response = await axios.get("/api/orders/mine", { withCredentials: true });
    const orden = response.data;

    vehiculoNombre.textContent = `${orden.vehiculo.marca} ${orden.vehiculo.modelo}`;
    vehiculoPlaca.textContent = orden.vehiculo.placa;
    vehiculoPropietario.textContent = orden.cliente.nombre;
    vehiculoMarca.textContent = orden.vehiculo.marca;
    vehiculoModelo.textContent = orden.vehiculo.modelo;

    pintarSegunFase(orden);
  } catch (error) {
    console.error("Error cargando la orden del cliente:", error);
    faseTitulo.textContent = "No se pudo cargar tu información";
    faseDescripcion.textContent = "";
    faseContenido.innerHTML = `<p class="sin-repuestos">Intenta recargar la página o contacta al taller.</p>`;
  }
};

cargarMiOrden();