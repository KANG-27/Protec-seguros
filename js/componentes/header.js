class HeaderComponent extends HTMLElement {
  async connectedCallback() {
    const res = await fetch('data/menu/seguros-menu.json');
    const data = await res.json();

    this.innerHTML = `
      <header class="header">
        <nav class="header__nav">
          <div class="header__logo-container">
            <img src="img/logo.png" alt="Logo" class="header__logo">
          </div>
          <div class="header__menu">
            <p class="header__desplegable"><a href="#">Inicio</a></p>
            <p class="header__desplegable" id="btnToggleMenu">
              Seguros <span class="arrow-down">
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#FFFFFF">
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                </svg>
              </span>
            </p>
            <p class="header__desplegable" id="btnTogglePagos">
              Pagos <span class="arrow-down">
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#FFFFFF">
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                </svg>
              </span>
            </p>
            <button class="header__button" id="btnCotiza">Cotiza ya</button>
          </div>
        </nav>

        <div class="header__content-seguros">
          <div class="header__content-buttons">
            <button class="header__section-button" id="btnPersonas">Personas</button>
            <button class="header__section-button" id="btnEmpresas">Empresas</button>
          </div>
          <div class="seguros__layout">
            <div id="categorias" class="seguros__categorias"></div>
            <div id="planes" class="seguros__planes">
              <p class="seguros__intro-text">Selecciona una categoría para ver los planes.</p>
            </div>
          </div>
        </div>

        <div class="header__content-pagos">
          <h3>Botones de Pago</h3>
          <div class="pagos__layout" id="pagosContainer"></div>
        </div>
      </header>
    `;

    const btnPersonas = this.querySelector('#btnPersonas');
    const btnEmpresas = this.querySelector('#btnEmpresas');
    const toggleMenu = this.querySelector('#btnToggleMenu');
    const pagosToggle = this.querySelector('#btnTogglePagos');
    const segurosContent = this.querySelector('.header__content-seguros');
    const pagosContent = this.querySelector('.header__content-pagos');
    const categoriasContainer = this.querySelector('#categorias');
    const planesContainer = this.querySelector('#planes');
    const pagosContainer = this.querySelector('#pagosContainer');

    // 🔁 Toggling Menús con rotación de flechas
    toggleMenu.addEventListener('click', () => {
      const isVisible = segurosContent.classList.contains('show');

      // Cierra ambos primero
      segurosContent.classList.remove('show');
      pagosContent.classList.remove('show');
      toggleMenu.querySelector('.arrow-down')?.classList.remove('rotate');
      pagosToggle.querySelector('.arrow-down')?.classList.remove('rotate');

      if (!isVisible) {
        segurosContent.classList.add('show');
        toggleMenu.querySelector('.arrow-down')?.classList.add('rotate');
      }
    });

    pagosToggle.addEventListener('click', async () => {
      const isVisible = pagosContent.classList.contains('show');

      // Cierra ambos primero
      segurosContent.classList.remove('show');
      pagosContent.classList.remove('show');
      toggleMenu.querySelector('.arrow-down')?.classList.remove('rotate');
      pagosToggle.querySelector('.arrow-down')?.classList.remove('rotate');

      if (!isVisible) {
        pagosContent.classList.add('show');
        pagosToggle.querySelector('.arrow-down')?.classList.add('rotate');

        if (!pagosContainer.hasChildNodes()) {
          const resPagos = await fetch('data/menu/botones-pago.json');
          const pagosData = await resPagos.json();
          renderPagos(pagosData.botonesPago);
        }
      }
    });

    // 🔘 Botones de pago
    function renderPagos(botones) {
      pagosContainer.innerHTML = '';
      for (const boton in botones) {
        const { color, link, nombre } = botones[boton];
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.className = 'pago__boton';
        a.style.backgroundColor = color;
        a.textContent = nombre;
        pagosContainer.appendChild(a);
      }
    }

    // 🔹 Renderizar categorías
    const renderCategorias = (tipo) => {
      categoriasContainer.innerHTML = '';
      const grupos = data[tipo];

      for (const grupo in grupos) {
        const btn = document.createElement('button');
        btn.classList.add('seguros__categorias-button');
        btn.innerHTML = `
          <span>${grupo}</span>
          <span class="icon-container">
            <svg class="icon-arrow icon-default" xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#008EFF"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
            <svg class="icon-arrow icon-active" xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#FFFFFF"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
          </span>
        `;

        btn.addEventListener('click', () => {
          const todos = categoriasContainer.querySelectorAll('button');
          todos.forEach(b => b.classList.remove('seguros__categorias-active'));
          btn.classList.add('seguros__categorias-active');
          renderPlanes(grupos[grupo]);
        });

        categoriasContainer.appendChild(btn);
      }
    };

    const renderPlanes = (planes) => {
      planesContainer.innerHTML = '';
      const ul = document.createElement('ul');
      ul.classList.add('seguros__planes-list', 'seguros__planes-fade');
      ul.innerHTML = planes.map(p => `<li><a href="#">${p}</a></li>`).join('');
      planesContainer.appendChild(ul);
      void ul.offsetWidth;
      ul.classList.add('show');
    };

    const renderAutoText = () => {
      planesContainer.innerHTML = '';
      const p = document.createElement('p');
      p.className = 'seguros__intro-text';
      p.textContent = 'Selecciona una categoría para ver los planes.';
      planesContainer.appendChild(p);
      void p.offsetWidth;
      p.classList.add('show');
    };

    btnPersonas?.addEventListener('click', () => {
      renderCategorias('personas');
      setActive(btnPersonas, btnEmpresas);
      window.location.hash = 'personas';
      renderAutoText();
    });

    btnEmpresas?.addEventListener('click', () => {
      renderCategorias('empresas');
      setActive(btnEmpresas, btnPersonas);
      window.location.hash = 'empresas';
      renderAutoText();
    });

    function setActive(activeBtn, inactiveBtn) {
      activeBtn.classList.add('active');
      inactiveBtn.classList.remove('active');
    }

    const tipoPorDefecto = window.location.hash.replace('#', '') || 'personas';
    renderCategorias(tipoPorDefecto);
    tipoPorDefecto === 'empresas'
      ? setActive(btnEmpresas, btnPersonas)
      : setActive(btnPersonas, btnEmpresas);
  }
}

customElements.define('header-component', HeaderComponent);
