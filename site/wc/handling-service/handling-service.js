import { globalStyles } from "../global/style.js";
import { login } from "../../script/auth.js";
import { hashPassword } from "../../script/auth.js";

class handlingService extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/handling-post/handling-service.html").then(
			(res) => res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
	}
}

customElements.define("handling-service", handlingPost);
