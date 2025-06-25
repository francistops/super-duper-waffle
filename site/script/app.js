
function display() {
  const wcDiv = document.getElementById("wcWrapper");

  wcDiv.appendChild(document.createElement("timer-wc"));
  wcDiv.appendChild(document.createElement("task-wc"));
  wcDiv.appendChild(document.createElement("pomodoro-timer"));
}

window.addEventListener("load", (e) => {
  display();
});

