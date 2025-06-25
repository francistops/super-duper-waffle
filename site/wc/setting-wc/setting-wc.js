// import { login } from "../../script/auth.js";

class settingWC extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    async loadContent() {
      const [html, css] = await Promise.all([
        fetch('/wc/setting-wc/setting-wc.html').then(res => res.text()),
        fetch('/wc/setting-wc/setting-wc.css').then(res => res.text())
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

      

      ["cancelButton", "cancelButton2"].forEach((id) => {
        const btn = this.shadowRoot.getElementById(id);
        btn.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("cancel-event", {
            bubbles: true,
            composed: true,
            detail: { from: "settings" }
          }));
        });
      });

    }

    cancel_button(id) {
      this.shadowRoot.getElementById(id).addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('cancel-event'))
      })

    }
  }
  customElements.define('setting-wc', settingWC);