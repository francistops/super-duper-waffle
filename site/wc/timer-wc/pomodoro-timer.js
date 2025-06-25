class PomodoroTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.workDuration = 1 * 60; // 25 minutes
    this.breakDuration = 5 * 60; // 5 minutes
    this.timeRemaining = this.workDuration;
    this.isRunning = false;
    this.isBreak = false;
    this.interval = null;

    this.render();
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#startBtn").addEventListener("click", () => this.toggle());
    this.shadowRoot.querySelector("#resetBtn").addEventListener("click", () => this.reset());
  }

  disconnectedCallback() {
    this.stop();
  }

  toggle() {
    this.isRunning ? this.stop() : this.start();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => this.tick(), 1000);
    this.updateUI();
  }

  stop() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.updateUI();
  }

  reset() {
    this.stop();
    this.timeRemaining = this.isBreak ? this.breakDuration : this.workDuration;
    this.updateUI();
  }

  tick() {
    this.timeRemaining--;

    if (this.timeRemaining <= 0) {
      this.isBreak = !this.isBreak;
      this.timeRemaining = this.isBreak ? this.breakDuration : this.workDuration;
    }

    this.updateUI();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  updateUI() {
    const label = this.isBreak ? "Pause" : "Travail";
    this.shadowRoot.querySelector("#mode").textContent = label;
    this.shadowRoot.querySelector("#timer").textContent = this.formatTime(this.timeRemaining);
    this.shadowRoot.querySelector("#startBtn").textContent = this.isRunning ? "Pause" : "Démarrer";
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .pomodoro {
          font-family: sans-serif;
          border: 2px solid #ddd;
          border-radius: 12px;
          padding: 1em;
          width: 200px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        #mode {
          font-size: 1.2em;
          margin-bottom: 0.5em;
        }
        #timer {
          font-size: 2em;
          margin: 0.5em 0;
        }
        button {
          margin: 0.2em;
          padding: 0.5em 1em;
          font-size: 1em;
          cursor: pointer;
          border-radius: 6px;
          border: none;
          background: #007bff;
          color: white;
        }
        button:hover {
          background: #0056b3;
        }
      </style>
      <div class="pomodoro">
        <div id="mode">Travail</div>
        <div id="timer">25:00</div>
        <button id="startBtn">Démarrer</button>
        <button id="resetBtn">Réinitialiser</button>
      </div>
    `;
  }
}

customElements.define("pomodoro-timer", PomodoroTimer);
