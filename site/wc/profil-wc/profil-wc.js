class profilWC extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    async loadContent() {
      const [html, css] = await Promise.all([
        fetch('/wc/profil-wc/profil-wc.html').then(res => res.text()),
        fetch('/wc/profil-wc/profil-wc.css').then(res => res.text())
      ]);
  
      const style = document.createElement('style');
      style.textContent = css;
  
      const template = document.createElement('template');
      template.innerHTML = html;
  
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    async connectedCallback() {
      await this.loadContent();
    }
  }

  customElements.define('profil-wc', profilWC);