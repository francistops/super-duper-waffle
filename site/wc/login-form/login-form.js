import { globalStyles } from "../global/style.js";
import { login } from "../../script/auth.js";
import { hashPassword } from "../../script/auth.js";

class loginForm extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/login-form/login-form.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();

		const form = this.shadowRoot.getElementById("login-post");
		const submitInp = this.shadowRoot.getElementById("loginButton");
		const { parseFormToObject } = await import("/script/utilform.js");

		submitInp.addEventListener("click", async (e) => {
			e.preventDefault();

			const user = parseFormToObject(form);

			console.log("in login-form WC user: ", user);
			if (!user.email || !user.password) {
				alert("Please fill in all fields.");
				return;
			} else {
				user["passhash"] = await hashPassword(user.password);
				delete user.password;
				const success = await login(user);
				if (!success) {
					console.error("login failed", success);
				} else {
					console.log("login success", success);

					if (user.role === "hairdresser") {
						this.dispatchEvent(
							new CustomEvent("user-is-hairdresser", {
								bubbles: true,
								composed: true,
								detail: { user },
							})
						);
					}

					this.dispatchEvent(
						new CustomEvent("user-logged-in", {
							bubbles: true,
							composed: true,
							detail: { status: "success" },
						})
					);
				}
			}
		});

		const cancelButton = this.shadowRoot.getElementById("cancelButton");
		cancelButton.addEventListener("click", (e) => {
			this.dispatchEvent(
				new CustomEvent("cancel-event", {
					bubbles: true,
					composed: true,
					detail: { from: "login", to: "home" },
				})
			);
		});
	}
}

customElements.define("login-form", loginForm);
