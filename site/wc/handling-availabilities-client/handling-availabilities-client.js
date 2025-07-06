import { globalStyles } from "../global/style.js";
import {
	getUsersByRole,
	getUserIdAvailabilities,
	getServices,
} from "../../script/auth.js";
import { formatDate } from "../../script/app.js";

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
		this.services = await getServices();

		const selectedHairdresser = this.shadowRoot.getElementById(
			"selectedHairdresser"
		);

		selectedHairdresser.addEventListener("change", (e) => {
			this.renderTable(e.target.value);
		});

		const allHairdressers = await getUsersByRole("hairdresser");
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
		await this.renderTable("all");
	}

	async renderTable(selectedHairdresser) {
		const tbody = this.shadowRoot.querySelector(
			".handling-availabilities-client tbody"
		);

		tbody.innerHTML = "";

		const filtered = this.availabilities.filter(
			(a) =>
				selectedHairdresser === "all" ||
				a.hairdresser_id === selectedHairdresser
		);

		for (const a of filtered) {
			const tr = document.createElement("tr");

			const tdDate = document.createElement("td");
			tdDate.textContent = formatDate(a.date);

			const tdHairdresser = document.createElement("td");
			tdHairdresser.textContent = a.hairdresser_id;

			const tdService = document.createElement("td");
			const serviceSelect = document.createElement("select");
			serviceSelect.innerHTML = `<option value="none">-</option>`;
			this.services.forEach((service) => {
				const opt = document.createElement("option");
				opt.value = service.id;
				opt.textContent = service.name;
				serviceSelect.appendChild(opt);
			});
			tdService.appendChild(serviceSelect);

			const tdAction = document.createElement("td");
			const button = document.createElement("button");
			button.textContent = "Prendre rendez-vous";
			button.disabled = true;
			tdAction.appendChild(button);

			serviceSelect.addEventListener("change", () => {
				button.disabled = serviceSelect.value === "none";
			});

			button.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("appointment-selected", {
						detail: {
							date: a.date,
							hairdresserId: a.hairdresser_id,
							service: serviceSelect.value,
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
