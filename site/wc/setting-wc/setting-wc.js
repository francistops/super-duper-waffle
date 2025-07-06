import { globalStyles } from "../global/style.js";
import { updateUser, hashPassword } from "../../script/auth.js";

class settingWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
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

		const { parseFormToObject } = await import("/script/utilform.js");

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user?.id) {
			alert("Utilisateur non identifié.");
			return;
		}

		const profilForm = this.shadowRoot.querySelector(".profil-form");
		if (profilForm) {
			profilForm.addEventListener("submit", (e) => e.preventDefault());
		}

		const submitUpdatedEmail = this.shadowRoot.getElementById("updateEmailButton");

		submitUpdatedEmail.addEventListener("click", async (e) => {
			const updatingEmail = parseFormToObject(profilForm);

			if (!updatingEmail.inpOldEmail || !updatingEmail.inpNewEmail || !updatingEmail.inpNewEmailConfirm) {
				alert("Veuillez remplir tous les champs.");
				return;
			}

			if (updatingEmail.inpNewEmail !== updatingEmail.inpNewEmailConfirm) {
				alert("Les 2 courriels doivent être identiques");
				return;
			}

			updatingEmail.id = user.id;

			const result = await updateUser(updatingEmail);
			if (!result) {
				alert("Modification échouée")
			} else {
				this.dispatchEvent(
					new CustomEvent("updated-user", {
						bubbles: true,
						composed: true,
						detail: { status: "success" },
					})
				);
			}
		});

		const passwordForm = this.shadowRoot.querySelector(".password-form");
		if (passwordForm) {
			passwordForm.addEventListener("submit", (e) => e.preventDefault());
		}

		const submitUpdatedPassword = this.shadowRoot.getElementById("updatePasswordButton");

		submitUpdatedPassword.addEventListener("click", async (e) => {

			const updatingPassword = parseFormToObject(passwordForm);

			if (!updatingPassword.inpOldPassword || !updatingPassword.inpNewPassword || !updatingPassword.inpNewPasswordConfirm) {
				alert("Veuillez remplir tous les champs.");
				return;
			}

			if (updatingPassword.inpNewPassword !== updatingPassword.inpNewPasswordConfirm) {
				alert("Les mots de passes doivent être identiques");
				return;
			}

			updatingPassword.passhash = await hashPassword(updatingPassword.inpNewPassword);
			delete updatingPassword.inpNewPassword;
			delete updatingPassword.inpNewPasswordConfirm;
			delete updatingPassword.inpOldPassword;

			updatingPassword.id = user.id;
			
			const result = await updateUser(updatingPassword)

			if (!result) {
				alert("Modification du mot de passe échouée");
				return;
			} else {
				this.dispatchEvent(
					new CustomEvent("updated-password", {
						bubbles: true,
						composed: true,
						detail: { status: "success" },
					})
				);
			}
		});

		["cancelButton", "cancelButton2"].forEach((id) => {
			const btn = this.shadowRoot.getElementById(id);
			if (btn) {
				btn.addEventListener("click", () => {
					this.dispatchEvent(
						new CustomEvent("cancel-event", {
							bubbles: true,
							composed: true,
							detail: { from: "settings" },
						})
					);
				});
			}
		});
	}

	disconnectedCallback() {
		const profilForm = this.shadowRoot.querySelector(".profil-form");
		if (profilForm) profilForm.reset();
	
		const passwordForm = this.shadowRoot.querySelector(".password-form");
		if (passwordForm) passwordForm.reset();
	}
	
}
customElements.define("setting-wc", settingWC);
