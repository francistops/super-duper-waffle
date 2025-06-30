import { globalStyles } from "../global/style.js";
import { login } from "../../script/auth.js";
import { hashPassword } from "../../script/auth.js";

class handlingAvailabilitiesClient extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/handling-availabilities-client/handling-availabilities-client.html"
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const select = this.shadowRoot.getElementById("search");
		if (!select) {
			console.warn("Élément #search introuvable dans le shadowRoot");
			return;
		}

		const physio = await getUsersByRole("physio");
		if (physio) {
			for (const user of physio) {
				const opt = document.createElement("option");
				opt.value = user.email;
				opt.textContent = user.email;
				select.appendChild(opt);
			}
		} else {
			console.warn("Aucun utilisateur avec le rôle physiothérapeute trouvé.");
		}
	}
}

customElements.define(
	"handling-availabilities-client",
	handlingAvailabilitiesClient
);
