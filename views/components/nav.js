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
 
// Aqui puedes ir agregando mas funciones (createNavHome, createNavLogin, etc.)
// cuando quieras reutilizar este mismo navbar.js en otras paginas del proyecto.
if (window.location.pathname.startsWith('/panel')) {
  createNavPanel();
}

if (window.location.pathname.startsWith('/edit-order')) {
  createNavPanel();
}
 
 
if (window.location.pathname.startsWith('/login')) {
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
 