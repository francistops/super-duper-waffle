import { login } from "../../script/auth.js";

class authLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async loadContent() {
    const [html, css] = await Promise.all([
      fetch('/wc/auth-login/auth-login.html').then(res => res.text()),
      fetch('/wc/auth-login/auth-login.css').then(res => res.text())
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



    const form = this.shadowRoot.getElementById('login-post');
    const submitInp = this.shadowRoot.getElementById('loginButton');
    const { parseFormToObject } = await import("/script/utilform.js");

    submitInp.addEventListener('click', async (e) => {
      e.preventDefault();

      const user = parseFormToObject(form);
      console.log('in auth-login WC user: ', user);

      const success = await login(user);

      if (!success) {
        alert("Connexion échouée. Vérifiez vos informations.");
        return;
      }

      const event = new CustomEvent('user-logged-in', {
        bubbles: true,
        composed: true,
        detail: { user }
      });
      this.dispatchEvent(event);
    });

        const cancelButton = this.shadowRoot.getElementById('cancelButton');
    cancelButton.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('cancel-event', {
        bubbles: true,
        composed: true,
        detail: { from: "login" }
      }));
    });
  }
}
  
customElements.define('auth-login', authLogin);