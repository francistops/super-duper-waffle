import { globalStyles } from "../global/style.js";
import { getDateFromToday, createAvailability, modifyAvailability } from "../../script/auth.js";

// Si j'ai le temps, ajouter changer le statut d'une disponibilité
// de "pending" à "cancelled" et inversement
// et ajouter un message de confirmation avant de changer le statut	

class handlingAvailabilitiesHairdresser extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/handling-availabilities-hairdresser/handling-availabilities-hairdresser.html" +
				"?t=" + Date.now()
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const inpDate = this.shadowRoot.querySelector("#inpDate");

		if (!inpDate) {
			console.warn("inpDate introuvable dans le DOM du composant.");
			return;
		}

		const minDate = getDateFromToday(1);
		const maxDate = getDateFromToday(28);
		inpDate.min = minDate;
		inpDate.max = maxDate;
		inpDate.value = minDate;

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
				if (this.selectedDateDisplay)
					this.selectedDateDisplay.textContent = `Date sélectionnée : ${formatDate(this.selectedDate)}`;
			}
		});

		this.shadowRoot.querySelector("form").addEventListener("submit", async (e) => {
			e.preventDefault();

			const date = inpDate.value;
			const user = JSON.parse(localStorage.getItem("user"));
			const hairdresserId = user?.id;

			if (!hairdresserId || !date) {
				console.warn("Données incomplètes");
				return;
			}

			const hours = [8, 9, 10, 11, 13, 14, 15, 16];

			for (const hour of hours) {
				const paddedHour = String(hour).padStart(2, "0");
				const availability_date = `${date}T${paddedHour}:00:00`;
			
				const result = await createAvailability({
					hairdresser_id: hairdresserId,
					availability_date,
				});
			
				if (!result.success) {
					console.error("Erreur lors de la création :", availability_date, "  ",hairdresserId);
				}
			}
		});
	}
}

customElements.define(
	"handling-availabilities-hairdresser",
	handlingAvailabilitiesHairdresser
);
