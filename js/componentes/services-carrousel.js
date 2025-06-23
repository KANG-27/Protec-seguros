class ServicesCarrousel extends HTMLElement {
    constructor() {
        super();
        this.detalle = null;               // Datos del JSON cargado
        this.groups = [];                  // ["Protec salud", "Protec personas", …]
        this.currentGroupIndex = 0;
        this.currentSlideIndex = 0;
    }

    async connectedCallback() {
        window.addEventListener('hashchange', () => this.render());
        await this.render();
    }

    async render() {
        // 1️⃣ Determinar tipo: personas / empresas
        const hashTipo = window.location.hash.replace('#', '');
        const sessionTipo = sessionStorage.getItem('homeTipo');
        const tipo = hashTipo || sessionTipo || 'personas';
        sessionStorage.setItem('homeTipo', tipo);

        // 2️⃣ Cargar JSON de detalle
        try {
            const res = await fetch(`data/detalle/${tipo}.json`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            this.detalle = await res.json();
        } catch (err) {
            console.error('Error cargando detalle:', err);
            this.innerHTML = `<p>Error al cargar servicios.</p>`;
            return;
        }

        // 3️⃣ Inicializar grupos y resets
        this.groups = Object.keys(this.detalle);
        this.currentGroupIndex = 0;
        this.currentSlideIndex = 0;

        // 4️⃣ Montar HTML base
        this.innerHTML = `
      <section class="services-carrousel">
        <div class="services-carrousel__content">
          <div class="services-carrousel__buttons" id="botonesServicios"></div>
          <div class="carousel">
            <div class="carousel__viewport">
              <div class="carousel__track"></div>
            </div>
            <div class="carousel__dots"></div>
          </div>
        </div>
      </section>
    `;

        // 5️⃣ Pintar botones de grupo y slides
        this._renderButtons();
        this._renderSlides();
    }

    _renderButtons() {
        const container = this.querySelector('#botonesServicios');
        container.innerHTML = '';

        // 'this.groups' ya es [ "Protec salud", "Protec personas", … ]
        this.groups.forEach((group, idx) => {
            const btn = document.createElement('button');
            btn.className = 'services-carrousel__button';
            if (idx === this.currentGroupIndex) btn.classList.add('active');

            // Extraemos el SVG y ponemos el texto
            const iconSvg = this.detalle[group].icon || '';
            btn.innerHTML = `
                <span class="btn-icon">${iconSvg}</span>
                <div class="btn-text-container">
                    <span class="btn-text-protec">Protec</span>
                    <span class="btn-text">${group}</span>
                </div>
                `;

            btn.addEventListener('click', () => {
                this.currentGroupIndex = idx;
                this.currentSlideIndex = 0;
                container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._renderSlides();
            });

            container.appendChild(btn);
        });
    }


    _renderSlides() {
        const track = this.querySelector('.carousel__track');
        track.innerHTML = '';
        const items = this.detalle[this.groups[this.currentGroupIndex]];
        items.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'carousel__card';
            card.innerHTML = `
        <img src="${item.imagen || 'img/placeholder.png'}"
             alt="${item.nombre}"
             class="card__image">
        <h2 class="card__title">Protec</h2>
        <h3 class="card__subtitule">${item.nombre}</h3>
        <p class="card__description">${item.descripcion}</p>
        <button class="card__button">Obtener</button>
      `;
            track.appendChild(card);
        });
        this._renderDots();
        this._updateCarousel();
    }

    _renderDots() {
        const dotsContainer = this.querySelector('.carousel__dots');
        dotsContainer.innerHTML = '';

        // 1️⃣ Recupera el objeto del grupo activo
        const groupObj = this.detalle[this.groups[this.currentGroupIndex]];

        // 2️⃣ Cuenta cuántos ítems hay
        const count = Array.isArray(groupObj.items) ? groupObj.items.length : 0;

        // 3️⃣ Por cada ítem, crea un punto
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot' + (i === this.currentSlideIndex ? ' active' : '');
            dot.addEventListener('click', () => {
                this.currentSlideIndex = i;
                this._updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }


    _updateCarousel() {
        const track = this.querySelector('.carousel__track');
        const slide = this.querySelector('.carousel__card');
        if (!slide) return;
        const style = getComputedStyle(slide);
        const gap = parseFloat(getComputedStyle(this.querySelector('.carousel__track')).gap);
        const slideW = slide.getBoundingClientRect().width + gap;
        const offset = -this.currentSlideIndex * slideW;
        track.style.transform = `translateX(${offset}px)`;

        // Actualizar punto activo
        this.querySelectorAll('.carousel__dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlideIndex);
        });
    }
}

customElements.define('services-carrousel', ServicesCarrousel);
