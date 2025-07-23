class Contact extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
      <section class="contact">
        <img src="./img/asesor.png" alt="Facebook" class="asesor">
        <div class="contact__content">
            <div class="contact__content__info">
                <div class="contact__content__info__data">
                     <h3>Telefono</h3>
                     <span>+57 3102497715</span>
                     <span>+57 3102497715</span>
                </div>
                <div class="contact__content__info__data">
                     <h3>Correo</h3>
                     <span>protec@gmail.com</span>
                     <span>protec@gmail.com</span>
                </div>
            </div>
            <div class="contact__content__redes">
                <h3>Redes sociales</h3>
                <img src="./img/instagramLogo.png" alt="instagramLogo" class="redes-sociales" id="instagram">
                <img src="./img/facebookLogo.png" alt="facebookLogo" class="redes-sociales" id="facebook">
                <img src="./img/youtubeLogo.png" alt="youtubeLogo" class="redes-sociales" id="youtube">
            </div>
        </div>
      </section>
    `;
        this.querySelector('#instagram')?.addEventListener('click', () => {
            window.open('https://www.instagram.com/protecsegurosltda/', '_blank');
        });
        this.querySelector('#facebook')?.addEventListener('click', () => {
            window.open('https://www.facebook.com/protecseguros.ltda.37', '_blank');
        });
        this.querySelector('#youtube')?.addEventListener('click', () => {
            window.open('https://www.youtube.com/@protecseguros7005', '_blank');
        });
    }

}

customElements.define('contact-component', Contact);
