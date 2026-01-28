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

/**
 * Create a section with a header and a body.
 * The body is a div that can be used to add more elements.
 * @param {Object} with name and header strings
 * return 
*/
function createSection(parent, { name, header }) {
  const section = addElement(parent, "section", ["mb-5"]);
  section.id = name.toLowerCase().replace(/\s+/g, "-");

  const container = addElement(section, "div", ["container", "p-4", "bg-light", "rounded"]);
  const h2 = addElement(container, "h2", ["mb-4"]);
  h2.textContent = header;
  
  const body = addElement(container, "div");
  body.id = `${name}-body`;
  return { section, body };
}

/**
 * Section class that contains all the elements for a section.
 * @class Section
 * @property {String} name - The name of the section.
 * @property {String} header - The header of the section.
 * @property {Function} generate - Function that generates the section content.
 */
class Section {
  constructor(name, header, generate) {
    this.name = name;
    this.header = header;
    this.generate = generate;
    this.linkText = name.replace(/\b\w/g, c => c.toUpperCase());
    this.id = name.toLowerCase().replace(/\s+/g, "-");
    this.bodyId = `${name}-body`;
    this.section = null;
    this.body = null;
  }
}
  
/**
 * Show the section with the given ID, hide all others.
 * @param {String} sectionID - The ID of the section to show.
 * return {void}
 *
 * Works if the sectionID has spaces by replacing them with hyphens
 */
function showSection(sectionID) {
  const formattedID = sectionID.replace(/\s+/g, "-").toLowerCase();

  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    if (section.id === formattedID) {
      // Set to visible
      section.style.display = "block";
    }
    else {
      section.style.display = "none";
    }
  });  
}

export { createElement, addElement, createSection, Section, showSection };
