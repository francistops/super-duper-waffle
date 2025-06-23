import { getTasks } from "../../script/auth.js";

class TimerWC extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.checkState();
  }

  disconnectedCallback() {
  }

  async checkState() {
    const result = await getTasks();
    console.log('auth.js', 'checkState', result)
    if (result.errorCode === 0) {
      this.render('online', result);
    } else {
      this.render('offline', result);
    }
  }


  render(state, result) {
    console.log('in render',result.rows[0])
    let color = "gray";
    if (state === "online") {
      color = "green";
    } else if (state === "offline") {
      color = "red";
    }

    this.shadowRoot.innerHTML = `
        <div> 
          <p style="color:${color};">${JSON.stringify(result.rows[0].content)}</p>
        </div>
    `;
  }
}

customElements.define("timer-wc", TimerWC);
