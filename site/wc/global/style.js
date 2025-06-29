// This file contains global styles for the web component.
// It can be imported into the main style file or used directly in the component.

// :host is used to style the custom element itself.
export const globalStyles = `
@import "https://unpkg.com/open-props";
@import "https://unpkg.com/open-props/normalize.min.css";
@import "https://unpkg.com/open-props/buttons.min.css";

:host {

}

*, *::before, *::after {
    box-sizing: border-box;
}

.hidden {
    display: none;
}

.invisible {
    display: none;
}

.main-wc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  padding: 2rem;
  justify-items: center;
}

.main-wc table {
  border-collapse: collapse;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.main-wc th,
.main-wc td {
  border: 1px solid #ccc;
  padding: 0.75rem;
}


`;
