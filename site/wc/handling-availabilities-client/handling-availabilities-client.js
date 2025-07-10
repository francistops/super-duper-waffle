import { globalStyles } from "../global/style.js";
import {
	getUsersByRole,
	getUserIdAvailabilities,
	getServices,
} from "../../script/auth.js";
import { formatDate, getDateFromTomorrow } from "../../script/app.js";

class handlingAvailabilitiesClient extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/handling-availabilities-client/handling-availabilities-client.html"
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		this.availabilities = await getUserIdAvailabilities();
		
		const selectedHairdresser = this.shadowRoot.getElementById(
			"selectedHairdresser"
		);
		const selectedService = this.shadowRoot.getElementById("selectedService");
		
		// faire le menu des coiffeuses
		
		const allHairdressers = await getUsersByRole("hairdresser");
		this.hairdressers = allHairdressers;

		if (allHairdressers) {
			for (const hairdresser of allHairdressers) {
				const opt = document.createElement("option");
				opt.value = hairdresser.id;
				opt.textContent = hairdresser.email;
				selectedHairdresser.appendChild(opt);
			}
		} else {
			console.warn("Aucun utilisateur avec le rôle hairdresser trouvé.");
		}

		// faire le menu des services
		const allServices = await getServices();
		this.services = allServices;

		if (allServices) {
			for (const service of allServices) {
				const opt = document.createElement("option");
				opt.value = service.id;
				opt.textContent = service.name;
				selectedService.appendChild(opt);
			}
		} else {
			console.warn("Aucun service trouvé.");
		}

		// ajouter la date choisie
		this.selectedDateDisplay = this.shadowRoot.getElementById("selectedDateDisplay");

		// faire le calendrier
		this.selectedDate = null;
		this.selectedHairdresserId = null;
		this.selectedServiceId = null;

		const inpDate = this.shadowRoot.querySelector("#inpDate");

		const today = new Date();
		const minDate = today.toISOString().split("T")[0];
		
		const future = new Date();
		future.setDate(today.getDate() + 28);
		const maxDate = future.toISOString().split("T")[0];
		
		// Affecte les bornes au champ date
		inpDate.min = minDate;
		inpDate.max = maxDate;
		
		// Initialise la valeur à aujourd’hui
		inpDate.value = minDate;
		
		// Stocke les valeurs pour validation ultérieure si nécessaire
		this.minDate = minDate;
		this.maxDate = maxDate;	

		selectedService.addEventListener("change", (e) => {
			this.selectedServiceId = e.target.value;
			this.tryRenderTable();
		});
		
		selectedHairdresser.addEventListener("change", (e) => {
			this.selectedHairdresserId = e.target.value;
			this.tryRenderTable();
		});
		
		inpDate.addEventListener("change", (e) => {
			const selected = new Date(e.target.value + "T00:00:00");
			const min = new Date(minDate + "T00:00:00");
			const max = new Date(maxDate + "T00:00:00");
		
			if (selected < min || selected > max) {
				alert(`Veuillez choisir une date entre ${minDate} et ${maxDate}.`);
				inpDate.value = minDate;
				this.selectedDate = minDate;
			} else {
				this.selectedDate = inpDate.value;
				this.selectedDateDisplay.textContent = `Date sélectionnée : ${formatDate(this.selectedDate)}`;
			}
		
			this.tryRenderTable();
		});
	}

	// initialiser le tableau des disponibilités

	tryRenderTable() {
		if (this.selectedHairdresserId && this.selectedDate && this.selectedServiceId) {
			this.renderTable(this.selectedHairdresserId, this.selectedDate, this.selectedServiceId);
		}
	}

	async renderTable(hairdresserId, selectedDate, serviceId) {

		const tbody = this.shadowRoot.querySelector(
			".handling-availabilities-client tbody"
		);
		tbody.innerHTML = "";
	
		const filtered = this.availabilities.filter((a) => {
			const sameHairdresser = a.hairdresser_id === hairdresserId;
			const sameDate = a.date.split("T")[0] === selectedDate;
			const sameService = a.service_id === serviceId;
			return sameHairdresser && sameDate && sameService;
		});
	
		if (filtered.length === 0) {
			const tr = document.createElement("tr");
			const td = document.createElement("td");
			td.colSpan = 4;
			td.textContent = "Aucune disponibilité pour cette date.";
			tr.appendChild(td);
			tbody.appendChild(tr);
			return;
		}
	
		for (const a of filtered) {
			const tr = document.createElement("tr");
	
			const tdDate = document.createElement("td");
			tdDate.textContent = formatDate(a.date);
	
			const tdHairdresser = document.createElement("td");
			tdHairdresser.textContent = a.hairdresser_id;
			tdHairdresser.textContent = this.hairdressers.find(
				(h) => h.id === a.hairdresser_id
			)?.email || a.hairdresser_id;

			const tdService = document.createElement("td");
			const service = this.services.find((s) => s.id === a.service_id);
			tdService.textContent = service ? service.name : a.service_id;

			const tdAction = document.createElement("td");
			const button = document.createElement("button");
			button.textContent = "Prendre rendez-vous";
			tdAction.appendChild(button);

			button.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("appointment-selected", {
						detail: {
							date: a.date,
							hairdresserId: a.hairdresser_id,
							service: a.service_id,
							availabilityId: a.id,
						},
						bubbles: true,
						composed: true,
					})
				);
			});
	
			tr.appendChild(tdDate);
			tr.appendChild(tdHairdresser);
			tr.appendChild(tdService);
			tr.appendChild(tdAction);
	
			tbody.appendChild(tr);
		}
	}	
}

customElements.define(
	"handling-availabilities-client",
	handlingAvailabilitiesClient
);
