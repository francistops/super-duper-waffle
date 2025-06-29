import { globalStyles } from '../global/style.js';
import { getUsersByRole } from "../../script/auth.js";

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
    const html = await fetch('/wc/profil-wc/profil-wc.html').then(res => res.text())
    const template = document.createElement('template');
    template.innerHTML = html;
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
      if (!select) {
        console.warn("Élément #search introuvable dans le shadowRoot");
        return;
      }
      
      const hairdressers = await getUsersByRole("hairdresser");
      if (hairdressers) {
        for (const user of hairdressers) {
          const opt = document.createElement("option");
          opt.value = user.email;
          opt.textContent = user.email;
          select.appendChild(opt);
        }
      } else {
        console.warn("Aucun utilisateur avec le rôle hairdresser trouvé.");
      }
    }
}

customElements.define('profil-wc', profilWC);