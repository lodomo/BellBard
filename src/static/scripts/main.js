const TITLE = "Bell Bard";
const H1_TEXT = "Bell Bard!";
const VERSION = "Alpha-0.0.1";

function main() {
  const main = document.getElementById("main");
  main.classList.add("container-fluid", "p-0");

  // Add a title to the page
  document.title = TITLE;
  
  renderHeader(main);
  renderBody(main);
  renderFooter(main);
}

function renderHeader(parent) {
  const header = addElement(parent, "header", ["bg-dark", "text-white", "p-3", "mb-4"]);
  const h1 = addElement(header, "h1");
  h1.innerText = H1_TEXT;
}

function renderBody(parent) {
  const body = addElement(parent, "main", ["container", "mb-4"]);
  const p = addElement(body, "p");
  p.innerText = "This is the main content area.";
}

function renderFooter(parent) {
  // Force footer to the bottom of the page
  const footer = addElement(parent, "footer", ["bg-light", "text-center", "p-3", "mt-auto", "border-top"]);
  const p = addElement(footer, "p");
  p.innerText = `Version: ${VERSION}`;
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

