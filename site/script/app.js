
function display() {
  const wcDiv = document.getElementById("wcWrapper");
  const timerWC = document.createElement("timer-wc");
  const taskWC = document.createElement("task-wc");

  wcDiv.appendChild(timerWC)
  wcDiv.appendChild(taskWC);
}

window.addEventListener("load", (e) => {
  display();
});

