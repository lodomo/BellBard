const TITLE = "Bell Bard";
const H1_TEXT = "Bell Bard!";
const VERSION = "Alpha-0.0.1";

function main() {
  document.title = TITLE;
  renderHeader();
  renderMain();
  renderFooter();

}

function renderHeader() {
  const header = document.getElementById("header");

  // Add a centered div with padding of 3,
  const headerDiv = addElement(header, "div", ["text-center", "p-2"]);

  // Add in an image of /idle.gif with alt text "Bell Bard Logo", width 100, height 100
  const logo = addElement(headerDiv, "img", []);
  logo.src = "static/images/idle.gif";
  logo.alt = "Bell Bard Logo";
  logo.width = 250;
  logo.height = 250;

  // On click of the image, change the image to something sing for 2 seconds.
  logo.addEventListener("click", () => {
    logo.src = "static/images/sing.gif";
    setTimeout(() => {
      logo.src = "static/images/idle.gif";
    }, 4000);
  });
}

function renderMain() {
  const main = document.getElementById("main");
  main.classList.add("container-fluid", "m-0", "p-0");
}

function renderFooter() {
  const footer = document.getElementById("footer");
  footer.classList.add("text-center", "p-3");
  footer.innerText = "© 2025 lodomo.dev | All rights reserved.";
}


/**
 * Create an element with the given tag and classes.
 * Does not add it to the DOM immediately.
 * @param {String} tag - The tag of the element to create.
 * @param {Array} classes - The classes to add to the element.
 * return {HTMLElement} - The created element.
 */
function createElement(tag, classes = []) {
  const element = document.createElement(tag);
  if (classes.length > 0) element.classList.add(...classes);
  return element;
}

/**
 * Add an element to the parent element with the given tag and classes.
 * Immediately appends the element to the parent.
 * If the parent is in the DOM, the element will be as well.
 *
 * @param {HTMLElement} parent - The parent element to append the element to.
 * @param {String} tag - The tag of the element to create.
 * @param {Array} classes - The classes to add to the element.
 *
 * return {HTMLElement} - The created element.
 */
function addElement(parent, tag, classes = []) {
  const element = createElement(tag, classes);
  parent.appendChild(element);
  return element;
}

main();

