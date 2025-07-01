import { globalStyles } from "../global/style.js";
import { getNextMonday } from "../../script/app.js";

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
			"/wc/handling-availabilities-hairdresser/handling-availabilities-hairdresser.html"
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		this.shadowRoot.querySelector("form").addEventListener("submit", (e) => {
			e.preventDefault();
			const date = this.shadowRoot.querySelector("#inpDate").value;
			console.log("Date soumise :", date);

			this.dispatchEvent(
				new CustomEvent("date-selected", {
					detail: { date },
					bubbles: true,
					composed: true,
				})
			);
		});

		const inpDate = this.shadowRoot.querySelector("#inpDate");
		if (!inpDate) {
			console.warn("inpDate introuvable dans le DOM du composant.");
			return;
		}

		const today = new Date();
		inpDate.min = today.toISOString().split("T")[0];

		inpDate.value = getNextMonday(today);

		inpDate.addEventListener("change", (e) => {
			const selected = e.target.value;
			const day = new Date(selected + "T00:00:00Z").getUTCDay();

			if (day !== 1) {
				alert("Veuillez choisir un lundi.");
				inpDate.value = getNextMonday(today);
			}
		});
	}
}

customElements.define(
	"handling-availabilities-hairdresser",
	handlingAvailabilitiesHairdresser
);
