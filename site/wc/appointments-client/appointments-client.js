import { globalStyles } from "../global/style.js";
import { getUserIdAppointments } from "../../script/auth.js";
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

		const user = JSON.parse(localStorage.getItem("user"));

		if (!user || !user.id) {
			console.error("Aucun utilisateur trouvé dans le localStorage");
			return;
		}

		const result = await getUserIdAppointments(user.id);

		result.appointments.forEach((a) => this.addNextAppointment(a));
	}

	addNextAppointment(appointment) {
		const appointmentTable =
			this.shadowRoot.querySelector(".appointment tbody");
		const row = document.createElement("tr");

		row.innerHTML = `
			<td class="action-cell"></td> <!-- cellule vide au départ -->
			<td>${formatDate(appointment.date)}</td>
			<td>${appointment.hairdresser_id}</td>
			<td>${appointment.service_id}</td>
		`;

		const firstCell = row.querySelector(".action-cell");

		if (appointment.status === "show" && !appointment.feedback_given) {
			const btn = document.createElement("button");
			btn.textContent = "Donner un avis";
			btn.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("give-feedback", {
						bubbles: true,
						composed: true,
						detail: { appointmentId: appointment.id },
					})
				);
			});
			firstCell.appendChild(btn);
		} else {
			firstCell.textContent = "-";
		}
		appointmentTable.appendChild(row);
	}

	updateTable(appointments) {
		const appointmentTable =
			this.shadowRoot.querySelector(".appointment tbody");
		appointmentTable.innerHTML = "";
		appointments.forEach((a) => this.addNextAppointment(a));
	}
}

customElements.define("appointments-client", appointmentsClient);
