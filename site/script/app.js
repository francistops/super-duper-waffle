window.addEventListener("load", (e) => {
  display();
});

function display() {
  const mainTag = document.querySelector("main");
  const WC = document.createElement("timer-wc");
  mainTag.innerHTML = "";
  mainTag.appendChild(WC);
}
