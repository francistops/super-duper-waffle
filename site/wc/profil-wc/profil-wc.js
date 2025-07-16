import { globalStyles } from "../global/style.js";
import { getUsersByRole } from "../../script/auth.js";

class profilWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/profil-wc/profil-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const deactivateAccountBtn = this.shadowRoot.getElementById(
			"deactivateAccountButton"
		);

		deactivateAccountBtn.addEventListener("click", (e) => {
			this.dispatchEvent(
				new CustomEvent("deactivate-account", {
					bubbles: true,
					composed: true,
				})
			);
		});
	}
}

customElements.define("profil-wc", profilWC);
