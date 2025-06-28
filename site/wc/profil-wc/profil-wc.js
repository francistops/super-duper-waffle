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

      const settingsBtn = this.shadowRoot.getElementById("goToSettingsButton");

      settingsBtn.addEventListener("click", (e) => {
        this.dispatchEvent(new CustomEvent("go-to-settings", {
          bubbles: true,
          composed: true,
        }));
        console.log("Settings button clicked");
      });
      const deleteAccountBtn = this.shadowRoot.getElementById("delete-account");
      deleteAccountBtn.addEventListener("click", (e) => {
        this.dispatchEvent(new CustomEvent("delete-account", {
          bubbles: true,
          composed: true,
        }));
        console.log("Delete account button clicked");
      });
    }
  }

  customElements.define('profil-wc', profilWC);