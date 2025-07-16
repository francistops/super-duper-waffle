import { getLogs } from "../../script/auth.js";

class DisplayLogElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
            <style>
                * {
                font-size: 0.7rem;
                }
                table, thead, tbody, tr, th, td {
                    border: 1px solid salmon;
                }
            </style>
        `.trim();
	}

	async loadContent() {
		const html = await fetch("/wc/display-log/display-log.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		const btn = this.shadowRoot.getElementById("getLogs");
		if (!btn) {
			btn.addEventListener("click", async (e) => {
				this.shadowRoot.querySelector("tbody").innerHTML = "";
				const logs = await getLogs();

				for (let i = 0; i < logs.length; i++) {
					this.addData(logs[i]);
				}
			});
		}
	}

	addData(log) {
		const tb = this.shadowRoot.querySelector("tbody");
		const trTag = document.createElement("tr");
		trTag.id = log.id;

		[
			log.timestamp,
			log.level,
			log.method,
			log.route,
			log.status,
			log.message,
			log.user_agent,
			log.error_message,
			log.stack_trace,
		].forEach((field) => {
			trTag.appendChild(document.createElement("td")).innerHTML = field;
		});

		tb.appendChild(trTag);
	}
}

customElements.define("display-log", DisplayLogElement);
