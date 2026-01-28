import { addElement, createElement } from "./utils.js";

/**
 * Class representing a bootstrap form.
 * Contains methods to generate form elements,
 * @class
 * :param {HTMLElement} parent - The parent element to which the form will be appended.
 * :param {string} id - The id of the form.
 *
 * Methods:
 * - textField: Generates a text input field.
 * 
 */
class Form {
  constructor(
    parent,
    id,
    classNames = ["mb-3"]
  ) {
    this.form = addElement(parent, "form", classNames);
    this.form.id = id;
  }

  submitButton({
    buttonText = "Submit",
    bootstrap = ["btn", "btn-primary"],
  }) {
    const button = addElement(this.form, "button", bootstrap);
    button.type = "submit";
    button.textContent = buttonText;
    return button;
  }

  addRow(){
    const row = addElement(this.form, "div", ["row"]);
    return row;
  }

  /**
   * Generate a form group with a label.
   * @param {HTMLElement} parent - The parent element to append the group to.
   * @param {String} id - The id of the input element.
   * @param {String} labelText - The text of the label.
   * @param {Array} bootstrap - The bootstrap classes to add to the group.
   *
   * return {Object} - The created group and label elements.
   */
  generateGroupLabel({
    parent = this.form,
    id,
    labelText,
    bootstrap = ["mb-3", "col-12"],
  }) {
    const group = addElement(parent, "div", bootstrap);
    const label = addElement(group, "label", ["form-label"]);
    label.htmlFor = id;
    label.textContent = labelText;
    return { group, label };
  }

  /** Generate an input element with the given parameters and append it to a form group.
   * If helpText is provided, add a help icon that shows the help text on click.
   * @param {HTMLElement} parent - The parent element to append the input to.
   * @param {String} id - The id of the input element.
   * @param {String} labelText - The text of the label.
   * @param {array} bootstrap - The bootstrap classes to add to the group.
   * @param {String} placeholder - The placeholder text for the input.
   * @param {String} helpText - The help text to show on click of the help icon. (Optional)
   *
   * return {HTMLInputElement} - The created input element.
   */
  generateInput({
    placeholder = "",
    helpText = null,
    ...rest
  }) {
    const { group, label } = this.generateGroupLabel(rest);
    const input = addElement(group, "input", ["form-control"]);
    input.id = rest.id;
    input.placeholder = placeholder;

    if (helpText) {
      const helpIcon = addElement(label, "i", [
        "bi",
        "bi-question-circle-fill",
        "ms-2",
        "m-1",
      ]);
      // Make it clickable and do nothing
      helpIcon.style.cursor = "pointer";
      helpIcon.setAttribute("data-bs-toggle", "tooltip");
      helpIcon.setAttribute("data-bs-placement", "top");
      helpIcon.setAttribute("title", helpText);

      // Add a div AFTER label that contains the help text
      const toolText = addElement(group, "small", ["form-text", "text-muted"]);
      toolText.innerText = helpText;
      // set display to none
      toolText.style.display = "none";

      // On Mouse click of the help icon, toggle the display
      helpIcon.addEventListener("click", () => {
        if (toolText.style.display === "none") {
          toolText.style.display = "block";
        } else {
          toolText.style.display = "none";
        }
      });
    }

    return input;
  }

  /** Generate an text input element with the given parameters and append it to a form group.
   * If helpText is provided, add a help icon that shows the help text on click.
   * @param {HTMLElement} parent - The parent element to append the input to.
   * @param {String} id - The id of the input element.
   * @param {String} labelText - The text of the label.
   * @param {array} bootstrap - The bootstrap classes to add to the group.
   * @param {String} placeholder - The placeholder text for the input.
   * @param {String} helpText - The help text to show on click of the help icon. (Optional)
   *
   * return {HTMLInputElement} - The created input element.
   */
  textField(rest) {
    const input = this.generateInput(rest);
    input.type = "text";
    return input;
  }

  /** Generate a number input element with the given parameters and append it to a form group.
   * If helpText is provided, add a help icon that shows the help text on click.
   * @param {HTMLElement} parent - The parent element to append the input to.
   * @param {String} id - The id of the input element.
   * @param {String} labelText - The text of the label.
   * @param {array} bootstrap - The bootstrap classes to add to the group.
   * @param {String} placeholder - The placeholder text for the input.
   * @param {String} helpText - The help text to show on click of the help icon. (Optional)
   * @param {Number} min - The minimum value for the number input. (Optional)
   * @param {Number} max - The maximum value for the number input. (Optional)
   * @param {Number} step - The step value for the number input. (Optional)
   * @param {Number} value - The default value for the number input. (Optional)
   *
   * return {HTMLInputElement} - The created input element.
   */
  numberField({ min, step, max, value, ...rest }) {
    if (rest.bootstrap === undefined) {
      rest.bootstrap = ["mb-3", "col-6", "col-md-2"];
    }

  const input = this.generateInput(rest);
  input.type = "number";
  if (min !== undefined) input.min = min;
  if (max !== undefined) input.max = max;
  if (step !== undefined) input.step = step;
  if (value !== undefined) input.value = value;

  return input;
  }

  /** Generate a radio field input element with the given parameters and append it to a form group.
   * If helpText is provided, add a help icon that shows the help text on click.
   * @param {HTMLElement} parent - The parent element to append the input to.
   * @param {String} id - The id of the input element.
   * @param {String} labelText - The text of the label.
   * @param {array} bootstrap - The bootstrap classes to add to the group.
   * @param {String} helpText - The help text to show on click of the help icon. (Optional)
   * @param {Array} options - The options for the radio field. Each option is an object with 'label' and 'value' properties.
   * @param {String} defaultValue - The default selected value for the radio field. (Optional)
   *
   * return {HTMLInputElement} - The created input element.
   */
  radioField({ options, defaultValue, ...rest }) {
    const { group } = this.generateGroupLabel(rest);

    const wrapper = addElement(group, "div", ["d-flex", "flex-wrap"]);

    options.forEach((option) => {
      const optionDiv = addElement(wrapper, "div", [
        "form-check",
        "form-check-inline",
      ]);
      const input = addElement(optionDiv, "input", ["form-check-input"]);
      input.type = "radio";
      input.name = rest.id;
      input.id = `${rest.id}-${option.value}`;
      input.value = option.value;

      if (option.value === defaultValue) {
        input.checked = true;
      }

      const optionLabel = addElement(optionDiv, "label", ["form-check-label"]);
      optionLabel.htmlFor = input.id;
      optionLabel.textContent = option.label;
    });

    return group;
  }

  checkboxField({
    gridColumns = "repeat(6, 1fr)",
    options,
    refresh = null,
    defaultChecked = true,
    defaultHidden = true,
    ...rest
  }) {
    const { group, label } = this.generateGroupLabel(rest);

    const hideShowWrapper = addElement(label, "div", ["d-inline-block", "ms-3"]);
    const hideShowButton = addElement(hideShowWrapper, "button", [
      "btn",
      "btn-sm",
      "btn-secondary",
    ]);
    hideShowButton.type = "button";
    hideShowButton.textContent = "Hide/Show";

    const checkAllWrapper = addElement(label, "div", ["d-inline-block", "ms-3"]);
    const checkAllButton = addElement(checkAllWrapper, "button", [
      "btn",
      "btn-sm",
      "btn-secondary",
    ]);
    checkAllButton.type = "button";
    checkAllButton.textContent = "Check All";
    checkAllButton.id = rest.id + "-check-all-button";

    checkAllButton.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(
        `#${rest.id}-checkboxes input[type="checkbox"]`
      );

      checkboxes.forEach((checkbox) => {
        // Check if display is not none
        if (checkbox.parentElement.style.display !== "none")
        {
          checkbox.checked = true;
        };
      });

      // Just dispatch "change" one to any checkbox to indicate change
      if (checkboxes.length > 0) {
        checkboxes[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    // Create a check none button
    const checkNoneWrapper = addElement(label, "div", ["d-inline-block", "ms-3"]);
    const checkNoneButton = addElement(checkNoneWrapper, "button", [
      "btn",
      "btn-sm",
      "btn-secondary",
    ]);
    checkNoneButton.type = "button";
    checkNoneButton.textContent = "Check None";
    checkNoneButton.id = rest.id + "-check-none-button";
    
    checkNoneButton.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(
        `#${rest.id}-checkboxes input[type="checkbox"]`
      );
      checkboxes.forEach((checkbox) => {
        if (checkbox.parentElement.style.display !== "none"){
          checkbox.checked = false;
        }
      });

      // Just dispatch "change" one to any checkbox to indicate change
      if (checkboxes.length > 0) {
        checkboxes[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    
    if (refresh) {
      const refreshWrapper = addElement(label, "div", ["d-inline-block", "ms-3"]);
      const refreshButton = addElement(refreshWrapper, "button", [
        "btn",
        "btn-sm",
        "btn-secondary",
      ]);
      refreshButton.type = "button";
      refreshButton.textContent = "Reload";
      refreshButton.addEventListener("click", refresh);
    }

    const searchWrapper = addElement(label, "div", ["d-inline-block", "ms-3", "me-3", "w-auto"]);
    const searchInput = addElement(searchWrapper, "input", ["form-control"]);
    searchInput.type = "text";
    searchInput.placeholder = "Filter...";
    searchInput.id = rest.id + "-search";

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // Add another button that says "clear filter"
    const clearFilterWrapper = addElement(label, "div", ["d-inline-block"]);
    const clearFilterButton = addElement(clearFilterWrapper, "button", [
      "btn",
      "btn-sm",
      "btn-secondary",
    ]);
    clearFilterButton.type = "button";
    clearFilterButton.textContent = "Clear Filter";
    clearFilterButton.id = rest.id + "-clear-filter-button";
    
    clearFilterButton.addEventListener("click", () => {
      searchInput.value = "";
      // Trigger input event to reset filter
      // Create a new input event
      const event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      searchInput.dispatchEvent(event);
    });

    function fuzzyMatch(search, text) {
      if (search === "") return true;
      
      let searchIndex = 0;
      for (let i = 0; i < text.length && searchIndex < search.length; i++) {
        if (text[i] === search[searchIndex]) {
          searchIndex++;
        }
      }
      return searchIndex === search.length;
    }

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const allCheckboxDivs = checkboxesSelect.querySelectorAll(".form-check");
      
      allCheckboxDivs.forEach((div) => {
        const label = div.querySelector("label");
        const text = label.textContent.toLowerCase();
        
        // Simple fuzzy match: check if all characters appear in order
        if (fuzzyMatch(searchTerm, text)) {
          div.style.display = "";  // SHOW the div
        } else {
          div.style.display = "none";  // HIDE the div
        }
      });
    });

    const checkboxesWrapper = addElement(group, "div");
    const checkboxesSelect = addElement(checkboxesWrapper, "div", [
      "p-2",
      "bg-white",
      "border",
      "rounded",
      "overflow-auto",
      "d-grid",
    ]);
    checkboxesSelect.style.gridTemplateColumns = gridColumns;
    checkboxesSelect.id = rest.id + "-checkboxes";

    this.updateCheckboxField(checkboxesSelect, options, defaultChecked, rest);

  function hideShowCheckBoxes() {
      if (checkboxesWrapper.style.display === "none") {
        checkboxesWrapper.style.display = "block";
      } else {
        checkboxesWrapper.style.display = "none";
      }
    }

    hideShowButton.addEventListener("click", hideShowCheckBoxes);

    if (defaultHidden) {
      checkboxesWrapper.style.display = "none";
    }

    return checkboxesSelect;
  }

  updateCheckboxField(checkboxesSelect, options, defaultChecked) {
    // Clear existing options
    checkboxesSelect.innerHTML = "";
    // console.log("Updating checkbox field with options:", options);
    
    if (!options || options.length === 0) {
      const noOptionsDiv = addElement(checkboxesSelect, "div", []);
      noOptionsDiv.textContent = "No options available.";
      return;
    }
    
    for (const option of options) {
      const optionDiv = addElement(checkboxesSelect, "div", ["form-check"]);
      const input = addElement(optionDiv, "input", ["form-check-input"]);
      input.type = "checkbox";
      input.id = `${checkboxesSelect.id}-${option.value}`;
      input.value = option.value;

      const optionLabel = addElement(optionDiv, "label", ["form-check-label"]);
      optionLabel.htmlFor = input.id;
      optionLabel.textContent = option.label;

      if (defaultChecked) {
        input.checked = true;
      }
    }
  }

  refreshCheckboxField(checkboxesSelect, options, id) {
    // Get the currently checked values
    const checkedValues = Array.from(
      checkboxesSelect.querySelectorAll("input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.value);

    // Update the checkbox field
    this.updateCheckboxField(checkboxesSelect, options, false);

    // Re-check the previously checked values
    const checkboxes = checkboxesSelect.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      if (checkedValues.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }


}


export { Form };
