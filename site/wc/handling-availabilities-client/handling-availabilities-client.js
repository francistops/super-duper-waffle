import { globalStyles } from "../global/style.js";
import { getUsersByRole, getAvailabilities } from "../../script/auth.js";

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

		const select = this.shadowRoot.getElementById("search");

		const physios = await getUsersByRole("physio");
		if (physios) {
			for (const user of physios) {
				const opt = document.createElement("option");
				opt.value = user.id;
				opt.textContent = user.email;
				select.appendChild(opt);
			}
		} else {
			console.warn("Aucun utilisateur avec le rôle physiothérapeute trouvé.");
		}

		this.availabilities = await getAvailabilities();

		select.addEventListener("change", () => {
			this.renderTable(select.value);
		});
		this.renderTable("all");
	}

	async fetchAvailabilities() {
		// ⚠️ Remplacer par appel à ton backend plus tard
		return [
			{ date: "2025-07-07", physio_id: "1", service_id: "Trauma" },
			{ date: "2025-07-08", physio_id: "2", service_id: "Commotion cérébrale" },
			{ date: "2025-07-09", physio_id: "1", service_id: "Douleur persistante" },
		];
	}

	renderTable(selectedPhysio) {
		const tbody = this.shadowRoot.querySelector(
			".handling-availabilities-client tbody"
		);
		tbody.innerHTML = "";

		const filtered = this.availabilities.filter(
			(a) => selectedPhysio === "all" || a.physio_id === selectedPhysio
		);

		filtered.forEach((a) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `
				<td>${a.date}</td>
				<td>${a.physio_id}</td>
				<td>${a.service_id}</td>
				<td><button class="acceptAppointmentButton">Prendre rendez-vous</button></td>
			`;

			tr.dataset.date = a.date;
			tr.dataset.physioId = a.physio_id;
			tr.dataset.service = a.service_id;

			tbody.appendChild(tr);
		});

		this.shadowRoot
			.querySelectorAll(".acceptAppointmentButton")
			.forEach((button) => {
				button.addEventListener("click", (event) => {
					const tr = event.target.closest("tr");
					const date = tr.dataset.date;
					const physioId = tr.dataset.physioId;
					const service = tr.dataset.service;

					this.dispatchEvent(
						new CustomEvent("appointment-selected", {
							detail: { date, physioId, service },
							bubbles: true,
							composed: true,
						})
					);
				});
			});
	}
}
customElements.define(
	"handling-availabilities-client",
	handlingAvailabilitiesClient
);
