import { globalStyles } from "../global/style.js";

class settingWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		// Create and append global styles, but you can ovewrite it by creating a css file in the current folder and liking it
		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/setting-wc/setting-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const updateUser = this.shadowRoot.getElementById("updateUser");
		const updatePassword = this.shadowRoot.getElementById("updatePassword");
		const { parseFormToObject } = await import("/script/utilform.js");

		this.shadowRoot
			.querySelector(".profil-form")
			.addEventListener("submit", (e) => {
				e.preventDefault();
			});

		this.shadowRoot
			.querySelector(".password-form")
			.addEventListener("submit", (e) => {
				e.preventDefault();
			});

		updateUser.addEventListener("click", async (e) => {
			this.dispatchEvent(
				new CustomEvent("updated-user", {
					bubbles: true,
					composed: true,
					detail: { status: "success" },
				})
			);
		});

		updatePassword
			.addEventListener("click", async (e) => {
				this.dispatchEvent(
					new CustomEvent("updated-password", {
						bubbles: true,
						composed: true,
						detail: { status: "success" },
					})
				);
			})

			[("cancelButton", "cancelButton2")].forEach((id) => {
				const btn = this.shadowRoot.getElementById(id);
				btn.addEventListener("click", () => {
					this.dispatchEvent(
						new CustomEvent("cancel-event", {
							bubbles: true,
							composed: true,
							detail: { from: "settings" },
						})
					);
				});
			});
	}
}
customElements.define("setting-wc", settingWC);
