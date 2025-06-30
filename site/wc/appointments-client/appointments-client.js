import { globalStyles } from "../global/style.js";
import { getAppointments } from "../../script/auth.js";
import { formatDate } from "../../script/app.js";

class appointmentsClient extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/appointments-client/appointments-client.html"
		).then((res) => res.text());
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
	  	<td>${formatDate(appointment.date)}</td>
     	<td>${appointment.physio_id}</td>
		<td>${appointment.service_id}</td>
    `;
		appointmentTable.appendChild(row);
	}
}

customElements.define("appointments-client", appointmentsClient);
