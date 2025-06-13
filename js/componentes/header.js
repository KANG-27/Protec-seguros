class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <nav class="header__nav">
          <div class="header__logo-container">
            <img src="img/logo.png" alt="Logo" class="header__logo">
          </div>
          <div class="header__menu">
            <a href="index.html" class="header__link">Inicio</a>
            <a href="#" class="header__link">Seguros</a>
            <a href="#" class="header__link">Pagos</a>
            <button class="header__button" id="btnPersonas">Cotiza ya</button>
            
          </div>
        </nav>
        <div class="header__content-seguros">
          <div class="header__content-buttons">
              <button class="header__section-button" id="btnPersonas">Personas</button>
              <button class="header__section-button" id="btnEmpresas">Empresas</button>
          </div>
        </div>

      </header>
    `;

    const btnPersonas = this.querySelector('#btnPersonas');
    const btnEmpresas = this.querySelector('#btnEmpresas');

    btnPersonas?.addEventListener('click', () => {
      window.location.hash = 'personas'; 
    });

    btnEmpresas?.addEventListener('click', () => {
      window.location.hash = 'empresas';
    });
  }
}

customElements.define('header-component', HeaderComponent);
