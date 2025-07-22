class HomeContent extends HTMLElement {
  connectedCallback() {
    window.addEventListener('hashchange', () => this.render());
    this.render();
  }

  render() {
    const hashTipo = window.location.hash.replace('#', '');
    const sessionTipo = sessionStorage.getItem('homeTipo');
    const tipo = hashTipo || sessionTipo || 'personas';

    sessionStorage.setItem('homeTipo', tipo); // mantiene la coherencia


    this.innerHTML = `
      <section class="home home--${tipo}">
        <div class="home__header">
          <div class="home__header__content">
            <h1>Protegemos lo que más valoras</h1>
            <p>Somos una agencia, encaminada a orientar profesionalmente en el sector asegurador a nuestros asegurados ofreciendo soluciones que garanticen la protección de su patrimonio y estabilidad de sus colaboradores </p>
            <button>Conocenos</button>
          </div>
          <img src="./img/home-${tipo}.png" alt="Imagen de cabecera" >
        </div>
        <h3 class="titulo-servicios">Servicios</h3>
        <services-carrousel></services-carrousel>
        <div class="home__aliados">
          <h3>Nuestros aliados</h3>
          <p>Conectamos con las mejores aseguradoras para darte siempre lo mejor</p>
          <div class="home__aliados__logos">
            <img src="./img/sura.png" alt="Aliados" class="logo-aliados">
            <img src="./img/aseguradoraSolidaria.png" alt="Aliados" class="logo-aliados">
            <img src="./img/mapfre.png" alt="Aliados" class="logo-aliados">
            <img src="./img/axaColpatria.png" alt="Aliados" class="logo-aliados">
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('home-content', HomeContent);
