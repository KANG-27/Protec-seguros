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
            <section >
                <div class="services-content">
                    <div class="services-content__info">
                        <h1>${data.nombre}</h1>
                        <span>${data.descripcion}</span>
                    </div>
                    <img src="${data.imagen}" alt="${data.nombre}" class="services-content__image">
                </div>
                <div class="services-content__details">
                    <div class="services-content__details__title">
                        <h2>¿Que incluye este seguro?</h2>
                    </div>
                    <div class="services-content__details__list">
                        <ul class="services-content__details__list__items__include">
                        </ul>
                        <ul class="services-content__details__list__items__none_include">
                        </ul>
                    </div>
                </div>
                <h3 class="titulo-servicios">Contactanos</h3>
                <contact-component></contact-component>
            </section>
        `
        const includeList = this.querySelector('.services-content__details__list__items__include');
        const noneIncludeList = this.querySelector('.services-content__details__list__items__none_include');

        const MAX_ITEMS = 10;

        renderList(includeList, data.incluye, 'ok');
        renderList(noneIncludeList, data.no_incluye, 'ko');

        function renderList(listEl, items, iconClass) {
            const frag = document.createDocumentFragment();

            items.forEach((item, i) => {
                const li = document.createElement('li');
                const icon = document.createElement('span');
                const text = document.createElement('p');
                icon.className = iconClass;
                text.textContent = item;
                li.append(icon, ' ', text);

                if (i >= MAX_ITEMS) li.classList.add('extra', 'hidden');
                frag.appendChild(li);
            });

            listEl.appendChild(frag);

            if (items.length > MAX_ITEMS) {
                const btn = document.createElement('button');
                btn.className = 'ver-mas';
                btn.textContent = `Ver más (${items.length - MAX_ITEMS})`;
                btn.dataset.expanded = 'false';

                btn.addEventListener('click', () => {
                    const expanded = btn.dataset.expanded === 'true';
                    listEl.querySelectorAll('.extra').forEach(li => {
                        li.classList.toggle('hidden', expanded); // si estaba expandido, vuelve a ocultar
                    });
                    btn.dataset.expanded = (!expanded).toString();
                    btn.textContent = expanded
                        ? `Ver más (${items.length - MAX_ITEMS})`
                        : 'Ver menos';
                });

                // coloca el botón justo después de la lista
                listEl.appendChild(btn);
            }
        }



    }
}

customElements.define('services-content', ServicesContent);