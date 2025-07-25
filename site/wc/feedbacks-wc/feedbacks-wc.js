import { globalStyles } from "../global/style.js";
import { getFeedbacks } from "../../script/auth.js";
import { formatDate } from "../../script/app.js";

class feedbacksWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/feedbacks-wc/feedbacks-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		
		const feedbacks = await getFeedbacks();
		feedbacks.feedbacks.forEach((a) => this.addNextFeedback(a));
	}

	addNextFeedback(feedback) {
		const feedbackTable = this.shadowRoot.querySelector(".feedback tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${feedback.hairdresser_id}</td>
			<td>${feedback.client_id}</td>
			<td>${feedback.rating}</td>
			<td>${feedback.comment}</td>
			<td>${formatDate(feedback.feedback_date)}</td>
    	`;
		feedbackTable.appendChild(row);
	}
}
customElements.define("feedbacks-wc", feedbacksWC);
