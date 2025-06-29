import { globalStyles } from "../global/style.js";
// import { login } from "../../script/auth.js";
// import { hashPassword } from "../../script/auth.js";

class mainWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/main-wc/main-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		this.dispatchEvent(new CustomEvent("load-complete"));
	}

	addNextService(service) {
		const servicesTable = this.shadowRoot.querySelector(".services tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>-</td>
      <td>${service.name}</td>
      <td>${service.duration}</td>
      <td>${service.price.toFixed(2)} €</td>
    `;
		servicesTable.appendChild(row);
	}

	addNextProduct(product) {
		const productsTable = this.shadowRoot.querySelector(".products tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>-</td>
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)} €</td>
    `;
		productsTable.appendChild(row);
	}

	addNextFeedback(feedback) {
		const feedbackTable = this.shadowRoot.querySelector(".feedback tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>${feedback.hairdresser}</td>
      <td>${feedback.client}</td>
      <td>${feedback.rating}</td>
      <td>${feedback.comment}</td>
    `;
		feedbackTable.appendChild(row);
	}

	addNextAppointment(appointment) {
		const appointmentTable =
			this.shadowRoot.querySelector(".appointment tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>-</td>
      <td>${appointment.hairdresser}</td>
      <td>${appointment.date}</td>
      <td>${appointment.service}</td>
    `;
		appointmentTable.appendChild(row);
	}
}

customElements.define("main-wc", mainWC);
