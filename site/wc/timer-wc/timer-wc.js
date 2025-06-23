import { getTasks } from "../../script/auth.js";

class TimerWC extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render("loading");
  }

  connectedCallback() {
    this.checkState();
  }

  disconnectedCallback() {
  }

  async checkState() {
    const result = await getTasks();
    console.log('auth.js', 'checkState', result.errorCode)
    if (result.errorCode === 0) {
      this.render('online');
    } else {
      this.render('offline');
    }
  }


  render(state) {
    console.log('in render')
    let color = "gray";
    if (state === "online") {
      color = "green";
    } else if (state === "offline") {
      color = "red";
    }

    this.shadowRoot.innerHTML = `
        <div> 
          <p style="color:${color};">timer placeholder</p>
        </div>
    `;
  }
}

customElements.define("timer-wc", TimerWC);
