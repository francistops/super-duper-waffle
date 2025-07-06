import { globalStyles } from "../global/style.js";
import {
	getUserIdAppointments,
	getUserIdAvailabilities,
	updateAvailability,
	updateAppointmentStatus,
} from "../../script/auth.js";

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

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user || !user.id) {
			console.error("Aucun utilisateur trouvé dans le localStorage");
			return;
		}

		const appointments = await getUserIdAppointments(user.id);
		const availabilities = await getUserIdAvailabilities(user.id);

		this.fillAgenda(appointments, availabilities);
	}

	renderAvailabilityCell(cell, availabilityId, currentStatus) {
		const isCancelled = currentStatus === "cancelled";
	
		cell.innerHTML = `
			<button class="toggleAvailability">
				${isCancelled ? "Ajouter la disponibilité" : "Annuler la disponibilité"}
			</button>
		`;
	
		cell.querySelector(".toggleAvailability").addEventListener("click", async () => {
			const newStatus = isCancelled ? "pending" : "cancelled";
	
			const success = await updateAvailability(availabilityId, newStatus);
			if (!success) return;
	
			this.renderAvailabilityCell(cell, availabilityId, newStatus);
		});
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
					<div><strong>Client:</strong> ${item.client_id}</div>
					<div><strong>Service:</strong> ${item.service_id}</div>
					<button class="markAsShow">Show</button>
					<button class="markAsNoShow">NoShow</button>
				`;
			
				cell.querySelector(".markAsShow").addEventListener("click", async () => {
					await updateAppointmentStatus(item.id, "show");
					cell.innerHTML = `<div>Rendez-vous complété ✅</div>`;
				});
			
				cell.querySelector(".markAsNoShow").addEventListener("click", async () => {
					await updateAppointmentStatus(item.id, "noShow");
					cell.innerHTML = `<div>Client absent ❌</div>`;
				});
			} else {
					this.renderAvailabilityCell(cell, item.id, item.status);				
			}
		});
	}
}

customElements.define("appointments-hairdresser", appointmentsHairdresser);
