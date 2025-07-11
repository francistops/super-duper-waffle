import { globalStyles } from "../global/style.js";
import { getServices } from "../../script/auth.js";

// import { login } from "../../script/auth.js";
// import { hashPassword } from "../../script/auth.js";

class servicesWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/services-wc/services-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const services = await getServices();
		// console.log(services, " services")
		services.forEach((a, index) => this.addNextService(a, index + 1));
	}

	addNextService(service, index) {
		const servicesTable = this.shadowRoot.querySelector(".services tbody");
		const row = document.createElement("tr");

		row.innerHTML = `
			<td>${index}</td>
			<td>${service.name}</td>
			<td>${service.duration}</td>
			<td>${Number(service.price).toFixed(2)} $</td>    
		`;
		servicesTable.appendChild(row);
	}
}

customElements.define("services-wc", servicesWC);
