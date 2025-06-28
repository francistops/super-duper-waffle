import { globalStyles } from '../global/style.js';

class profilWC extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      
      // Create and append global styles, but you can ovewrite it by creating a css file in the current folder and liking it
      const globalStyle = document.createElement('style');
      globalStyle.textContent = globalStyles;
      shadow.appendChild(globalStyle);
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
      
			const select = this.shadowRoot.getElementById("search");

      try {
        console.log("Loading hairdressers...");
        const res = await fetch("https://api.ft.ca/user");
        const data = await res.json();
        console.log("Hairdressers loaded:", data.users);

        const hairdressers = data.users.filter(u => u.role === "hairdresser");

        for (const user of hairdressers) {
        const option = document.createElement("option");
        option.value = user.email;
        option.textContent = user.email; // ou `${user.firstName} ${user.lastName}` si dispo
        select.appendChild(option);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des coiffeuses :", err);
      }
    }
  }

  customElements.define('profil-wc', profilWC);