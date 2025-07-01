import { globalStyles } from "../global/style.js";
import {
	getAppointments,
	getAvailabilities,
	deleteAvailability,
	updateAppointmentStatus,
} from "../../script/auth.js";
import { formatDate } from "../../script/app.js";

class appointmentsHairdresser extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/appointments-hairdresser/appointments-hairdresser.html"
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		this.dispatchEvent(new CustomEvent("load-complete"));

		const appointments = await getAppointments();
		const availabilities = await getAvailabilities();

		this.fillAgenda(appointments, availabilities);
	}

	fillAgenda(appointments, availabilities) {
		const allItems = [...appointments, ...availabilities];

		allItems.forEach((item) => {
			const date = new Date(item.date);
			const day = date.getDay();
			const hour = date.toTimeString().slice(0, 5);

			if (day < 1 || day > 5) return;

			const cell = this.shadowRoot.querySelector(
				`td[data-day="${day}"][data-hour="${hour}"]`
			);

			if (!cell) return;

			if (item.client_id) {
				cell.innerHTML = `
					<div>Client: ${item.client_id}</div>
					<div>Service: ${item.service_id}</div>
					<button class="markAsShow">Marquer comme complété</button>
				`;
				cell
					.querySelector(".markAsShow")
					.addEventListener("click", async () => {
						await updateAppointmentStatus(item.id, "show");
						cell.querySelector(".markAsShow").remove();
					});
			}
		});
	}
}

customElements.define("appointments-hairdresser", appointmentsHairdresser);
