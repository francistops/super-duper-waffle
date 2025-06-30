import { globalStyles } from "../global/style.js";
import { getAppointments } from "../../script/auth.js";

// import { login } from "../../script/auth.js";
// import { hashPassword } from "../../script/auth.js";

class appointmentsWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/appointments-wc/appointments-wc.html").then(
			(res) => res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		this.dispatchEvent(new CustomEvent("load-complete"));
		const appointments = await getAppointments();
		appointments.forEach((a) => this.addNextAppointment(a));
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

customElements.define("appointments-wc", appointmentsWC);
