import { getTasks } from "../../script/auth.js";

class TaskWC extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async loadContent() {
    const [html, css] = await Promise.all([
      fetch("/wc/template/template.html").then((res) => res.text()),
      fetch("/wc/template/template.css").then((res) => res.text()),
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
    this.shadowRoot.getElementById("task").innerHTML = this.getTask();
    const taskWrapper = this.shadowRoot.getElementById("taskWrapper");
    this.checkState();
    // timerToggle.addEventListener("click", (e) => {
    //   console.log('timer toggle click')
    //   this.timerToggle();
    //   const event = new CustomEvent("event-timer-toggle", {
    //     bubbles: true,
    //     composed: true,
    //     detail: { from: "timer toggle!" },
    //   });
    //   this.dispatchEvent(event);
    // });

    // setInterval(() => {
    //   this.checkState();
    // }, interval = 1000);


  }

  disconnectedCallback() {
    console.log("Timer-wc disconnected");
    clearInterval(this.checkStateInterval);
  }

  async checkState() {
    const result = await getTasks();
    console.log("auth.js", "checkState", result);
    if (result.errorCode === 0) {
      this.render("online", result);
    } else {
      this.render("offline", result);
    }
  }

  timer() {
    return new Date().getTime()
  }

  timerToggle() {
    return true;
  }

  render(state, result) {
    console.log("in render", result.rows[0]);
    let color = "gray";
    if (state === "online") {
      color = "green";
    } else if (state === "offline") {
      color = "red";
    }

    this.shadowRoot.innerHTML = `
        <div>
          <p style="color:${color};">
          ${JSON.stringify(result.rows[0].content)}
          </p>
        </div>
    `;
  }
}

customElements.define("task-wc", TaskWC);
