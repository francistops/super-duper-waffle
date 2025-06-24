
function display() {
  const wcDiv = document.getElementById("wcWrapper");
  const WC = document.createElement("timer-wc");
  wcDiv.appendChild(WC);
}

window.addEventListener("load", (e) => {
  display();
});
