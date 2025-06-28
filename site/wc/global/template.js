import { globalStyles } from "../global/style.js";

class TemplateWebComponent extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		// Create and append global styles, but you can ovewrite it by creating a css file in the current folder and liking it
		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const [html, css] = await Promise.all([
			fetch("/wc/template/template.html").then((res) => res.text()),
			fetch("/wc/template/template.css").then((res) => res.text()),
		]);

		const style = document.createElement("style");
		style.textContent = css;

		const template = document.createElement("template");
		template.innerHTML = html;

		this.shadowRoot.appendChild(style);
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
	}

	disconnectedCallback() {}
}

customElements.define("template", TemplateWebComponent);
