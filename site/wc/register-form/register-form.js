import { globalStyles } from "../global/style.js";
import { hashPassword, register } from "../../script/auth.js";

class registerForm extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		// Create and append global styles, but you can ovewrite it by creating a css file in the current folder and liking it
		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/register-form/register-form.html").then(
			(res) => res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		const form = this.shadowRoot.getElementById("registerForm");
		const submitInp = this.shadowRoot.getElementById("registerButton");
		const { parseFormToObject } = await import("/script/utilform.js");

		form.addEventListener("submit", (e) => {
			e.preventDefault();
		});

		submitInp.addEventListener("click", async (e) => {
			const user = parseFormToObject(form);

			if (!user.email || !user.password || !user.confirmPassword) {
				alert("Please fill in all fields.");
				return;
			} else if (user.password !== user.confirmPassword) {
				alert("Passwords do not match.");
				return;
			} else if (user.password.length < 0) {
				alert("Password must be at least 7 characters long.");
				return;
			} else {
				user["passhash"] = await hashPassword(user.password);
				delete user.password;
				delete user.confirmPassword;
				console.log("in register-form WC user: ", user);
				const result = await register(user);
				if (!result) {
					alert("Inscription échouée. Vérifiez vos informations.");
				} else {
					alert("Inscription réussie. Vous pouvez maintenant vous connecter.");
				}
			}

			this.dispatchEvent(
				new CustomEvent("registered", {
					bubbles: true,
					composed: true,
					detail: { status: "success" },
				})
			);
		});

		const cancelButton = this.shadowRoot.getElementById("cancelButton");
		cancelButton.addEventListener("click", (e) => {
			const event = new CustomEvent("cancel-event", {
				bubbles: true,
				composed: true,
				detail: { from: "register", to: "login" },
			});
			this.dispatchEvent(event);
		});
	}
}

customElements.define("register-form", registerForm);
