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
`;
