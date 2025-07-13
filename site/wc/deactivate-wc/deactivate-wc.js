import { globalStyles } from "../global/style.js";

class deactivateWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/deactivate-wc/deactivate-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user?.id) {
			alert("Utilisateur non identifié.");
			return;
		}

		const firstDeactivateBtn = this.shadowRoot.getElementById("firstDeactivateButton");
		const confirmationSection = this.shadowRoot.getElementById("confirmationSection");
		
		firstDeactivateBtn.addEventListener("click", () => {
			firstDeactivateBtn.style.display = "none";
			confirmationSection.style.display = "block";
		});
		

		const finalDeactivateBtn = this.shadowRoot.getElementById("finalDeactivateButton");
		finalDeactivateBtn.addEventListener("click", (e) => {
			this.dispatchEvent(
				new CustomEvent("deactivate-account", {
					bubbles: true,
					composed: true,
					detail: { userId: user.id },
				})
			);
			console.log("Final deactivate button clicked");
		});

		const cancelButton = this.shadowRoot.getElementById("cancelButton");
		cancelButton.addEventListener("click", (e) => {
			this.dispatchEvent(
				new CustomEvent("cancel-event", {
					bubbles: true,
					composed: true,
					detail: { from: "deactivate", to: "home" },
				})
			);
		});
	}	
}
customElements.define("deactivate-wc", deactivateWC);
