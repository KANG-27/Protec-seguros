class ServicesContent extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    async render() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id').split('/');
        const type = urlParams.get('type');

        let data

        try {
            const res = await fetch(`data/detalle/${type}.json`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            data = await res.json();
        } catch (err) {
            console.error('Error cargando detalle:', err);
            this.innerHTML = `<p>Error al cargar servicios.</p>`;
            return;
        }

        data = data[id[0]].items.find(item => item.nombre.trim().replace(/\s+/g, '') === id[1]);

        console.log(data)

        this.innerHTML = `
            <section class="services-content">
                <div class="services-content__info">
                    <h1>${data.nombre}</h1>
                    <span>${data.descripcion}</span>
                </div>
                <img src="${data.imagen}" alt="${data.nombre}" class="services-content__image">
            </section>
        `
    }
}

customElements.define('services-content', ServicesContent);