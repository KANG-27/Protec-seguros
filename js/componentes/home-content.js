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
      <section class="home home--personas" style="display: ${tipo === 'personas' ? 'block' : 'none'};">
        <h2>Contenido para Personas</h2>
      </section>

      <section class="home home--empresas" style="display: ${tipo === 'empresas' ? 'block' : 'none'};">
        <h2>Contenido para Empresas</h2>
      </section>
    `;
  }
}

customElements.define('home-content', HomeContent);
