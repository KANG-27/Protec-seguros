class HeaderComponent extends HTMLElement {
  async connectedCallback() {
    // 1️⃣ Carga los datos de servicios y pagos
    const [resSeg, resPag] = await Promise.all([
      fetch('data/menu/seguros-menu.json'),
      fetch('data/menu/botones-pago.json')
    ]);
    this.dataSeg = await resSeg.json();
    this.dataPag = await resPag.json();

    // 2️⃣ Detecta vista actual y renderiza
    this._isMobile = null;
    this._renderAccordingToViewport();
    window.addEventListener('resize', () => this._renderAccordingToViewport());
  }

  _renderAccordingToViewport() {
    const isMobile = window.matchMedia('(max-width:768px)').matches;
    if (isMobile === this._isMobile) return;
    this._isMobile = isMobile;
    this.innerHTML = '';
    if (isMobile) this._renderMobile();
    else this._renderDesktop();
  }

  // ─── DESKTOP ─────────────────────────────────────────────────────────────
  _renderDesktop() {
    this.innerHTML = `
      <header class="header">
        <nav class="header__nav">
          <div class="header__logo-container">
            <img src="img/logo.png" alt="Logo" class="header__logo">
          </div>
          <div class="header__menu">
            <a href="/#" class="header__desplegable">Inicio</a>
            <p class="header__desplegable" id="btnToggleMenu">
              Seguros <span class="arrow-down"><svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="#FFFFFF"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg></span>
            </p>
            <p class="header__desplegable" id="btnTogglePagos">
              Pagos <span class="arrow-down"><svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="#FFFFFF"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg></span>
            </p>
            <button class="header__button" id="btnCotiza">Cotiza ya</button>
          </div>
        </nav>

        <div class="header__content-seguros">
          <div class="header__content-buttons">
            <button class="header__section-button active" id="btnPersonas">Personas</button>
            <button class="header__section-button" id="btnEmpresas">Empresas</button>
          </div>
          <div class="seguros__layout">
            <div id="categorias" class="seguros__categorias"></div>
            <div id="planes" class="seguros__planes"></div>
          </div>
        </div>

        <div class="header__content-pagos">
        <h2>Botones de pago</h2>
          <div class="pagos__layout" id="pagosContainer">
          </div>
        </div>
      </header>
    `;
    this._hookDesktop();
  }

  _hookDesktop() {
    const data = this.dataSeg;
    const pagosData = this.dataPag.botonesPago;

    const toggleSeg = this.querySelector('#btnToggleMenu');
    const togglePag = this.querySelector('#btnTogglePagos');
    const segContent = this.querySelector('.header__content-seguros');
    const pagContent = this.querySelector('.header__content-pagos');

    const btnPersonas = this.querySelector('#btnPersonas');
    const btnEmpresas = this.querySelector('#btnEmpresas');

    const categoriasContainer = this.querySelector('#categorias');
    const planesContainer = this.querySelector('#planes');
    const pagosContainer = this.querySelector('#pagosContainer');

    // Render botones de pago
    const renderPagos = () => {
      pagosContainer.innerHTML = '';
      for (let butonPago in pagosData) {
        const { color, link, nombre } = pagosData[butonPago];
        const a = document.createElement('a');
        a.href = link; a.target = '_blank';
        a.className = 'pago__boton';
        a.style.backgroundColor = color;
        a.textContent = nombre;
        pagosContainer.appendChild(a);
      }
    };

    // Render categorías con flechas
    const renderCategorias = tipo => {
      categoriasContainer.innerHTML = '';
      const grupos = data[tipo];
      for (let grupo in grupos) {
        const btn = document.createElement('button');
        btn.className = 'seguros__categorias-button';
        btn.innerHTML = `
          <span class="text">${grupo}</span>
          <span class="icon-container">
            <svg class="icon-arrow icon-default" xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10" fill="#008EFF"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
            <svg class="icon-arrow icon-active"  xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10" fill="#FFFFFF"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
          </span>
        `;
        btn.addEventListener('click', () => {
          categoriasContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderPlanes(grupos[grupo]);
        });
        categoriasContainer.appendChild(btn);
      }
    };

    // Render planes con animación
    const renderPlanes = arr => {
      planesContainer.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'seguros__planes-list seguros__planes-fade';
      ul.innerHTML = arr.map(p => `<li><a href="#">${p}</a></li>`).join('');
      planesContainer.appendChild(ul);
      void ul.offsetWidth;
      ul.classList.add('show');
    };

    // Texto intro
    const renderIntro = () => {
      planesContainer.innerHTML = '';
      const p = document.createElement('p');
      p.className = 'seguros__intro-text';
      p.textContent = 'Selecciona una categoría para ver los planes.';
      planesContainer.appendChild(p);
      void p.offsetWidth;
      p.classList.add('show');
    };

    // Toggles Seguros / Pagos
    toggleSeg.addEventListener('click', () => {
      const open = !segContent.classList.contains('show');
      segContent.classList.toggle('show', open);
      pagContent.classList.remove('show');
      toggleSeg.querySelector('.arrow-down').classList.toggle('rotate', open);
      togglePag.querySelector('.arrow-down').classList.remove('rotate');
      if (open && !pagosContainer.hasChildNodes()) renderPagos();
    });
    togglePag.addEventListener('click', () => {
      const open = !pagContent.classList.contains('show');
      pagContent.classList.toggle('show', open);
      segContent.classList.remove('show');
      togglePag.querySelector('.arrow-down').classList.toggle('rotate', open);
      toggleSeg.querySelector('.arrow-down').classList.remove('rotate');
      if (open && !pagosContainer.hasChildNodes()) renderPagos();
    });

    // Tabs Personas / Empresas
    btnPersonas.addEventListener('click', () => {
      btnPersonas.classList.add('active');
      btnEmpresas.classList.remove('active');
      sessionStorage.setItem("homeTipo", "personas")
      window.location.hash = '#personas';
      renderCategorias('personas');
      renderIntro();
    });
    btnEmpresas.addEventListener('click', () => {
      btnEmpresas.classList.add('active');
      btnPersonas.classList.remove('active');
      sessionStorage.setItem("homeTipo", "empresas")
      window.location.hash = '#empresas';
      renderCategorias('empresas');
      renderIntro();
    });

    // Inicializa
    btnPersonas.classList.add('active');
    renderCategorias('personas');
    renderIntro();
    renderPagos();
  }

  // ─── MOBILE ──────────────────────────────────────────────────────────────
  _renderMobile() {
    this.innerHTML = `
      <header class="header">
        <nav class="header__nav">
          <div class="header__logo-container">
            <img src="img/logo.png" alt="Logo" class="header__logo">
          </div>
          <button id="btnMobileToggle" class="header__mobile-toggle">☰</button>
        </nav>
        <div class="header__mobile-modal">
          <div class="mobile__header">
            <img src="img/logo.png" class="mobile__logo">
            <button id="btnMobileClose" class="mobile__close">✕</button>
          </div>
          <div class="mobile__tabs">
            <button id="mobilePersonas" class="active">Personas</button>
            <button id="mobileEmpresas">Empresas</button>
          </div>
          <div id="mobileContent" class="mobile__content"></div>
          <button class="header__button" id="btnCotiza">Cotiza ya</button>
        </div>
      </header>
    `;
    this._hookMobile();
  }

  _hookMobile() {
    const data = this.dataSeg;
    const pagosData = this.dataPag.botonesPago;

    const btnOpen = this.querySelector('#btnMobileToggle');
    const btnClose = this.querySelector('#btnMobileClose');
    const modal = this.querySelector('.header__mobile-modal');
    const tabPers = this.querySelector('#mobilePersonas');
    const tabEmp = this.querySelector('#mobileEmpresas');
    const content = this.querySelector('#mobileContent');

    // Abrir/Cerrar modal con animación CSS
    btnOpen.addEventListener('click', () => modal.classList.add('show'));
    btnClose.addEventListener('click', () => modal.classList.remove('show'));

    // Genera acordeones
    const makeAccordion = (title, items, type) => {
      const sec = document.createElement('div');
      sec.className = 'mobile__section';
      sec.innerHTML = `
        <div class="mobile__section-header">
          ${title} <span class="arrow-down"><svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="#008EFF"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg></span>
        </div>
        <div class="mobile__section-body"></div>
      `;
      const hdr = sec.querySelector('.mobile__section-header');
      const body = sec.querySelector('.mobile__section-body');
      hdr.addEventListener('click', () => {
        const open = sec.classList.toggle('open');
        hdr.querySelector('.arrow-down').classList.toggle('rotate', open);
      });
      if (type === 'pagos') {
        for (let n in pagosData) {
          const a = document.createElement('a');
          a.href = pagosData[n].link;
          a.target = '_blank';
          a.className = 'pago__boton';
          a.style.backgroundColor = pagosData[n].color;
          a.textContent = pagosData[n].nombre;
          body.appendChild(a);
        }
      } else {
        items.forEach(i => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="#">${i}</a>`;
          body.appendChild(li);
        });
      }
      return sec;
    };

    // Renderiza acordeones según tab
    const renderMobileSection = tipo => {
      content.innerHTML = '';
      content.appendChild(makeAccordion('Pagos', [], 'pagos'));
      for (let grp in data[tipo]) {
        content.appendChild(makeAccordion(grp, data[tipo][grp], 'seguro'));
      }
    };

    // Tabs mobile
    tabPers.addEventListener('click', () => {
      tabPers.classList.add('active');
      tabEmp.classList.remove('active');
      sessionStorage.setItem("homeTipo", "personas")
      window.location.hash = 'personas';
      renderMobileSection('personas');
    });
    tabEmp.addEventListener('click', () => {
      tabEmp.classList.add('active');
      tabPers.classList.remove('active');
      sessionStorage.setItem("homeTipo", "empresas")
      window.location.hash = '#empresas';
      renderMobileSection('empresas');
    });

    // Inicial
    renderMobileSection('personas');
  }
}

customElements.define('header-component', HeaderComponent);
