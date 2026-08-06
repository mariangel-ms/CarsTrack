import { cargarNotificacionPresupuesto } from "/components/response-budget/response-budget.js";
const navbar = document.querySelector('#navbar');
 
const createNavPanel = () => {
  navbar.innerHTML = `
    <header class="admin-header">
      <img src="/img/logo.png" alt="CarTrack Logo" class="logo-barra" />
      <div class="usuario-menu">
        <span class="usuario-rol">🟢 Administrador</span>
        <button id="close-btn" class="btn-cerrar-sesion">Cerrar sesión</button>
      </div>
    </header>
  `;
};


const createNavLogin = () => {
  navbar.innerHTML = `
    <header class="admin-header">
      <img src="/img/logo.png" alt="CarTrack Logo" class="logo-barra" />
      <div class="usuario-menu">
        <button id="volver-btn" class="volver-btn">Volver</button>
      </div>
    </header>
  `;
};
 

const createNavClient = () => {
  navbar.innerHTML = `
    <header class="admin-header">
      <img src="/img/logo.png" alt="CarTrack Logo" class="logo-barra" />
      <div class="usuario-menu">
        
        <!-- Contenedor del sistema de notificaciones -->
        <div class="dropdown-notificaciones-container">
          <button id="btn-campana" class="btn-campana-nav" aria-label="Notificaciones">
            🔔 <span class="badge-contador hidden" id="badge-contador">0</span>
          </button>
          
          <div id="dropdown-notif" class="dropdown-notif-menu hidden">
            <div class="dropdown-notif-header">
              <span>Notificaciones</span>
              <span class="marcar-leido" id="notif-estado-texto">Al Día</span>
            </div>
            <div class="dropdown-notif-body" id="lista-notificaciones-slot">
              <!-- Aquí se inyectará dinámicamente si hay notificación o estará vacío -->
              <div class="notif-vacia">No tienes notificaciones nuevas</div>
            </div>
          </div>
        </div>

        <button id="close-btn" class="btn-cerrar-sesion">Cerrar sesión</button>
      </div>
    </header>
  `;

  const btnCampana = document.getElementById("btn-campana");
  const dropdownNotif = document.getElementById("dropdown-notif");
  const badgeContador = document.getElementById("badge-contador");
  const listaSlot = document.getElementById("lista-notificaciones-slot");
  const notifEstadoTexto = document.getElementById("notif-estado-texto");

  // Función para verificar el estado de la orden y pintar la notificación condicionalmente
  const verificarNotificaciones = async () => {
    try {
      const response = await axios.get("/api/orders/mine", { withCredentials: true });
      const orden = response.data;

      const esPendiente = orden.aprobacion_reparacion === "pendiente" && orden.estado?.toLowerCase().includes("presupuesto") && orden.presupuesto_enviado == true;

      if (esPendiente) {
        // Muestra el punto rojo/dorado en la campana
        badgeContador.textContent = "1";
        badgeContador.classList.remove("hidden");
        notifEstadoTexto.textContent = "Nueva";

        // Inserta la tarjeta de previsualización en el dropdown
        listaSlot.innerHTML = `
          <div class="item-notif-preview" id="trigger-presupuesto">
            <div class="notif-icono-wrapper">🚗</div>
            <div class="notif-texto">
              <strong>¿Acepta la reparación?</strong>
              <p>Han cargado el presupuesto de tu vehículo. Haz clic para revisar.</p>
              <span class="notif-tiempo">Acción requerida</span>
            </div>
          </div>
        `;

        // Evento al hacer clic en la notificación para abrir el modal
        document.getElementById("trigger-presupuesto")?.addEventListener("click", () => {
          dropdownNotif.classList.add("hidden");
          cargarNotificacionPresupuesto(orden._id);
        });

      } else {
        // Si ya respondió o no hay nada pendiente, se queda vacío
        badgeContador.classList.add("hidden");
        notifEstadoTexto.textContent = "Al Día";
        listaSlot.innerHTML = `<div class="notif-vacia">No hay notificaciones pendientes</div>`;
      }
    } catch (error) {
      console.error("Error al verificar notificaciones:", error);
      badgeContador.classList.add("hidden");
      listaSlot.innerHTML = `<div class="notif-vacia">Sin notificaciones</div>`;
    }
  };

  // Ejecutamos la verificación al cargar la barra
  verificarNotificaciones();

  // Abrir / cerrar dropdown al hacer clic en la campana
  btnCampana?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const isOpen = !dropdownNotif.classList.contains("hidden");
    
    if (isOpen) {
      dropdownNotif.classList.add("hidden");
    } else {
      // Actualiza el estado al abrir por si acaba de responder
      await verificarNotificaciones();
      dropdownNotif.classList.remove("hidden");
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!dropdownNotif.contains(e.target) && !btnCampana.contains(e.target)) {
      dropdownNotif.classList.add("hidden");
    }
  });
};

if (window.location.pathname.startsWith('/panel')) {
  createNavPanel();
}

if (window.location.pathname.startsWith('/edit-order')) {
  createNavPanel();
}

if (window.location.pathname.startsWith('/client-panel')) {
  createNavClient();
}
 
if (window.location.pathname.startsWith('/login')) {
  createNavLogin();
}

if (window.location.pathname.startsWith('/signup')) {
  createNavLogin();
}

const closeBtn = document.querySelector('#close-btn');
 
closeBtn?.addEventListener('click', async () => {
  try {
    await axios.get('/api/logout', { withCredentials: true });
    window.location.pathname = '/';
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
});

const volverBtn = document.querySelector('#volver-btn');
volverBtn?.addEventListener('click', () => {
  window.location.pathname = '/';
});
 