class HeaderComponent extends HTMLElement {
  async connectedCallback() {
    // 🔹 Carga la data del JSON
    const res = await fetch('data/menu/seguros-menu.json');
    const data = await res.json();

    this.innerHTML = `
      <header class="header">
        <nav class="header__nav">
          <div class="header__logo-container">
            <img src="img/logo.png" alt="Logo" class="header__logo">
          </div>
          <div class="header__menu">
            <a href="index.html" class="header__link">Inicio</a>
            <a href="#" class="header__link" id="btnToggleMenu">Seguros</a>
            <a href="#" class="header__link">Pagos</a>
            <button class="header__button" id="btnCotiza">Cotiza ya</button>
          </div>
        </nav>

        <div class="header__content-seguros" style="display: none;">
          <div class="header__content-buttons">
            <button class="header__section-button" id="btnPersonas">Personas</button>
            <button class="header__section-button" id="btnEmpresas">Empresas</button>
          </div>
          <div class="seguros__layout">
            <div id="categorias" class="seguros__categorias"></div>
            <div id="planes" class="seguros__planes">
              <p style="color: #888;">Selecciona una categoría para ver los planes.</p>
            </div>
          </div>
        </div>
      </header>
    `;

    const btnPersonas = this.querySelector('#btnPersonas');
    const btnEmpresas = this.querySelector('#btnEmpresas');
    const toggleMenu = this.querySelector('#btnToggleMenu');
    const segurosContent = this.querySelector('.header__content-seguros');
    const categoriasContainer = this.querySelector('#categorias');
    const planesContainer = this.querySelector('#planes');

    // Mostrar/ocultar menú
    toggleMenu.addEventListener('click', () => {
      segurosContent.style.display = segurosContent.style.display === 'none' ? 'flex' : 'none';
    });

    // 🔹 Renderizar grupos (Protec salud, etc.)
    const renderCategorias = (tipo) => {
      categoriasContainer.innerHTML = '';
      const grupos = data[tipo];

      for (const grupo in grupos) {
        const btn = document.createElement('button');
        btn.textContent = grupo;
        btn.addEventListener('click', () => {
          // Quitar clase activa de todos
          const todos = categoriasContainer.querySelectorAll('button');
          todos.forEach(b => b.classList.remove('seguros__categorias-active'));

          // Activar el botón actual
          btn.classList.add('seguros__categorias-active');

          // Renderizar los planes
          renderPlanes(grupos[grupo]);
        });

        categoriasContainer.appendChild(btn);
      }
    };

    // 🔹 Renderizar planes a la derecha
    const renderPlanes = (planes) => {
      planesContainer.innerHTML = `
        <ul class="seguros__planes-list">
          ${planes.map(p => `<li><a href="#">${p}</a></li>`).join('')}
        </ul>
      `;
    };
    const renderAutoText = () => {
      planesContainer.innerHTML = `
        <p style="color: #888;">Selecciona una categoría para ver los planes.</p>
      `;
    };

    // Escucha botones
    btnPersonas?.addEventListener('click', () => {
      renderCategorias('personas');
      setActive(btnPersonas, btnEmpresas);
      window.location.hash = 'personas';
      renderAutoText()
    });

    btnEmpresas?.addEventListener('click', () => {
      renderCategorias('empresas');
      setActive(btnEmpresas, btnPersonas);
      window.location.hash = 'empresas';
      renderAutoText()
    });
    // Función que gestiona el estilo activo
    function setActive(activeBtn, inactiveBtn) {
      activeBtn.classList.add('active');
      inactiveBtn.classList.remove('active');
    }
    // Detectar si ya hay un hash al cargar la página
    const tipoPorDefecto = window.location.hash.replace('#', '') || 'personas';
    renderCategorias(tipoPorDefecto);

    // Activar el botón correcto visualmente
    if (tipoPorDefecto === 'empresas') {
      setActive(btnEmpresas, btnPersonas);
    } else {
      setActive(btnPersonas, btnEmpresas);
    }

    // Por defecto cargar personas
    renderCategorias('personas');
  }
}

customElements.define('header-component', HeaderComponent);
