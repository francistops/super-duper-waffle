import { getTasks } from "../../script/auth.js";

class TimerWC extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async loadContent() {
    const [html, css] = await Promise.all([
      fetch("/wc/timer-wc/timer-wc.html").then((res) => res.text()),
      fetch("/wc/timer-wc/timer-wc.css").then((res) => res.text()),
    ]);
    const style = document.createElement("style");
    style.textContent = css;
    const template = document.createElement("template");
    template.innerHTML = html;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    await this.loadContent();
    this.checkState();
  }

  disconnectedCallback() {}

  async checkState() {
    const result = await getTasks();
    console.log("auth.js", "checkState", result);
    if (result.errorCode === 0) {
      this.render("online", result);
    } else {
      this.render("offline", result);
    }
  }

  render(state, result) {
    console.log("in render", result.rows[0]);
    let color = "gray";
    if (state === "online") {
      color = "green";
    } else if (state === "offline") {
      color = "red";
    }

    // this.shadowRoot.innerHTML = `
    //     <div> 
    //       <p style="color:${color};">
    //       ${JSON.stringify(result.rows[0].content)}
    //       </p>
    //     </div>
    //`;
  }
}

customElements.define("timer-wc", TimerWC);
