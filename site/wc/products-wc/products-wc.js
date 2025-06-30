import { globalStyles } from "../global/style.js";
// import { getProducts } from "../../script/auth.js";

// import { login } from "../../script/auth.js";
// import { hashPassword } from "../../script/auth.js";

class productsWC extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		const globalStyle = document.createElement("style");
		globalStyle.textContent = globalStyles;
		shadow.appendChild(globalStyle);
	}

	async loadContent() {
		const html = await fetch("/wc/products-wc/products-wc.html").then((res) =>
			res.text()
		);
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		await this.loadContent();
		this.dispatchEvent(new CustomEvent("load-complete"));
		// const products = await getProducts();
		// products.forEach((a) => this.addNextProduct(a));
	}

	addNextProduct(product) {
		const productsTable = this.shadowRoot.querySelector(".products tbody");
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>-</td>
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)} €</td>
    `;
		productsTable.appendChild(row);
	}
}

customElements.define("products-wc", productsWC);
