import { globalStyles } from "../global/style.js";
import { getFeedbacks } from "../../script/auth.js";

class handlingFeedback extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch(
			"/wc/handling-feedback/handling-feedback.html"
		).then((res) => res.text());
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		this.dispatchEvent(new CustomEvent("load-complete"));
		const feedbacks = await getFeedbacks();
		feedbacks.forEach((a) => this.addNextFeedback(a));
	}

	addNextFeedback(feedback) {
		const feedbacksTable = this.shadowRoot.querySelector(".feedbacks tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>-</td>
      <td>${feedback.name}</td>
      <td>${feedback.duration}</td>
      <td>${feedback.price.toFixed(2)} €</td>
    `;
		feedbacksTable.appendChild(row);
	}
}

customElements.define("handling-feedback", handlingFeedback);
