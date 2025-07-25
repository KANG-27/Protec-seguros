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
          <div class="home__aliados__logos__carrousel" id="aliados-carousel">
            <div class="home__aliados__logos__carrousel__track">
              <div class="carousel__slide">
                <img src="./img/sura.png" alt="Aliados" >
              </div>
              <div class="carousel__slide">
                <img src="./img/aseguradoraSolidaria.png" alt="Aliados" >
              </div>
              <div class="carousel__slide">
              <img src="./img/mapfre.png" alt="Aliados" >
              </div>
              <div class="carousel__slide">
                <img src="./img/axaColpatria.png" alt="Aliados" >
              </div>
              <div class="carousel__slide">
                <img src="./img/segurosBolivar.png" alt="Aliados" >
              </div>
              <div class="carousel__slide">
                <img src="./img/segurosDelEstado.png" alt="Aliados" >
              </div>
            </div>
          </div>
        </div>
        <h3 class="titulo-servicios">Contactanos</h3>
        <contact-component></contact-component>
      </section>
    `;

    const track = document.querySelector('#aliados-carousel .home__aliados__logos__carrousel__track')
    const slides = Array.from(track.children);
    let index = 0;

    // --- Breakpoints ---
    function getSlidesPerView() {
      if (window.matchMedia('(min-width:1024px)').matches) return 3; // desktop
      if (window.matchMedia('(min-width:768px)').matches) return 2; // tablet
      return 1;                                                     // mobile
    }

    let spv = getSlidesPerView(); // slides per view

    // Recalcular al cambiar tamaño
    window.addEventListener('resize', () => {
      spv = getSlidesPerView();
      index = 0;            // opcional: regresar al inicio para evitar saltos raros
      moverA(index);
    });

    function moverA(i) {
      const offset = i * (100);                   // ancho de “página”
      track.style.transform = `translateX(-${offset}%)`;
    }

    function siguiente() {
      const totalPaginas = Math.ceil(slides.length / spv);
      index = (index + 1) % totalPaginas;
      moverA(index);
    }

    setInterval(siguiente, 3000);

  }
}

customElements.define('home-content', HomeContent);
