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

		if (!user?.id) {
			console.error("Aucun utilisateur trouvé dans le localStorage");
			return;
		}

		const result = await getUserIdAppointments(user.id);

		if (!result.success) {
			console.error(
				"Erreur lors de la récupération des rendez-vous :",
				result.message
			);
			this.renderEmptyTable("Erreur de chargement des rendez-vous.");
			return;
		}

		if (!result.appointments.appointment.length) {
			this.renderEmptyTable("Aucun rendez-vous à venir.");
			return;
		}

		result.appointments.appointment.forEach((a) => this.addNextAppointment(a));
	}

	addNextAppointment(appointment) {
		const tbody = this.shadowRoot.querySelector(".appointment tbody");
		const row = document.createElement("tr");

		row.innerHTML = `
			<td class="action-cell"></td>
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

		tbody.appendChild(row);
	}

	renderEmptyTable(message) {
		const tbody = this.shadowRoot.querySelector(".appointment tbody");
		tbody.innerHTML = `
			<tr><td colspan="4" style="text-align:center;">${message}</td></tr>
		`;
	}

	updateTable(appointments) {
		const tbody = this.shadowRoot.querySelector(".appointment tbody");
		tbody.innerHTML = "";
		appointments.forEach((a) => this.addNextAppointment(a));
	}
}

customElements.define("appointments-client", appointmentsClient);
