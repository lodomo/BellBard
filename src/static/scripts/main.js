const TITLE = "Bell Bard";
const H1_TEXT = "Bell Bard!";
const VERSION = "Alpha-0.0.1";

const VOLUME = {
  0: "static/images/volume1.png",
  25: "static/images/volume2.png",
  50: "static/images/volume3.png",
  75: "static/images/volume4.png",
  100: "static/images/volume5.png",
}

const DOOR_CLOSED = {
  false: "static/images/doors1.png",
  true: "static/images/doors2.png",
}

const DOOR_OPEN = {
  false: "static/images/doors3.png",
  true: "static/images/doors4.png",
}

const PLAY_ICON = "static/images/play.png";

let LAST_VOLUME = 50;

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
  logo.width = 125;
  logo.height = 125;

  // On click of the image, change the image to something sing for 2 seconds.
  logo.addEventListener("click", () => {
    logo.src = "static/images/sing.gif";
    fetch("/play", {
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error playing sound: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error("Error playing sound:", error);
      });
    setTimeout(() => {
      logo.src = "static/images/idle.gif";
    }, 4000);
  });

  renderVolumeControl(header);
  return;
}

function renderMain() {
  const main = document.getElementById("main");
  main.classList.add("container-fluid", "m-0", "p-0");
  renderSoundList(main);
  return;
}

function renderFooter() {
  const footer = document.getElementById("footer");
  footer.innerText = "©2026 lodomo";
}

function renderVolumeControl(parent) {
  const volumeControl = addElement(parent, "div", ["volume-control"]);

  /* Two column layout with an image, and a bar */
  const row = addElement(volumeControl, "div", ["row", "align-items-center", "m-0", "p-0"]);
  const col1 = addElement(row, "div", ["col-3", "text-center", "p-0"]);
  const col2 = addElement(row, "div", ["col-9", "p-2"]);

  const volumeIcon = addElement(col1, "img", ["volume-icon"]);
  volumeIcon.id = "volume-icon";
  volumeIcon.src = VOLUME[50];
  volumeIcon.alt = "Volume Icon";

  const volumeBar = addElement(col2, "input", ["form-range", "volume-bar"]);
  volumeBar.id = "volume-bar";
  volumeBar.type = "range";
  volumeBar.min = 0;
  volumeBar.max = 100;
  volumeBar.value = LAST_VOLUME;

  function setVolumeIcon() {
    if (volumeBar.value == 0) {
      volumeIcon.src = VOLUME[0];
    }
    else if (volumeBar.value < 10) {
      volumeIcon.src = VOLUME[25];
    }
    else if (volumeBar.value < 50) {
      volumeIcon.src = VOLUME[50];
    }
    else if (volumeBar.value < 99) {
      volumeIcon.src = VOLUME[75];
    }
    else {
      volumeIcon.src = VOLUME[100];
    }
  }

  /* If the volume icon is clicked, set the volume to 0, and change the icon to volume off. If it is clicked again, set the volume to 50, and change the icon to volume on. */
  volumeIcon.addEventListener("click", () => {
    if (volumeBar.value > 0) {
      LAST_VOLUME = volumeBar.value;
      volumeBar.value = 0;
    }
      else {
      volumeBar.value = LAST_VOLUME;
    }
    setVolumeIcon();
  });

  /* If the volume bar is changed, and the value is 0, change the icon to volume off. If the value is greater than 0, change the icon to volume on. */
  volumeBar.addEventListener("input", () => {
    setVolumeIcon();
  });
}

function renderSoundList(parent) {
  const soundList = addElement(parent, "div", ["sound-list"]);

  // Put a throbber in the middle of the sound list that says "Loading..." for 2 seconds, then remove it and add some sounds to the list.
  const throbber = addElement(soundList, "div", ["throbber", "text-center"]);
  throbber.innerText = "Loading...";
  throbber.id = "throbber";

  fetch("/sounds")
    .then(response => response.json())
    .then(data => {
      console.log("Fetched sounds:", data);
      data.forEach(sound => {
        addSoundToList(soundList, sound.name, sound.id, sound.on_open, sound.on_close);
      });
      })
    .catch(error => {
      console.error("Error fetching sounds:", error);
      throbber.innerText = "Error loading sounds.";
    })
    .finally(() => {
        throbber.remove();
    });
 }

function addSoundToList(parent, name, id, onOpen, onClose) {
  const row = addElement(parent, "div", ["row", "align-items-center", "m-0", "p-0"]);

  /* Single element will be DOOR_OPEN[false], DOOR_CLOSED[false], name, and play button. */
  const col1 = addElement(row, "div", ["col-2", "text-center", "p-0"]);
  const col2 = addElement(row, "div", ["col-2", "text-center", "p-0"]);
  const col3 = addElement(row, "div", ["col-6", "text-center", "p-0"]);
  const col4 = addElement(row, "div", ["col-2", "text-center", "p-0"]);
  
  const doorOpenIcon = addElement(col1, "img", ["door-open-icon"]);
  doorOpenIcon.id = `door-open-icon-${name}`;
  doorOpenIcon.src = DOOR_OPEN[onOpen];
  doorOpenIcon.alt = "Door Open Icon";

  const doorClosedIcon = addElement(col2, "img", ["door-closed-icon"]);
  doorClosedIcon.id = `door-closed-icon-${name}`;
  doorClosedIcon.src = DOOR_CLOSED[onClose];
  doorClosedIcon.alt = "Door Closed Icon";

  const soundName = addElement(col3, "div", ["sound-name"]);
  soundName.innerText = name;

  const playButton = addElement(col4, "img", ["play-button"]);
  playButton.id = `play-button-${name}`;
  playButton.src = PLAY_ICON;
  playButton.alt = "Play Button"; 

  /* Toggle the door buttons if they're clicked, leave a placeholder for API work */
  doorOpenIcon.addEventListener("click", () => {
    onOpen = !onOpen;
    doorOpenIcon.src = DOOR_OPEN[onOpen];

    fetch(`/toggle_on_open/${id}`, {
      method: "POST",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error toggling on_open for sound ${name}: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(`Error toggling on_open for sound ${name}:`, error);
      });


    });
  
  doorClosedIcon.addEventListener("click", () => {
    onClose = !onClose;
    doorClosedIcon.src = DOOR_CLOSED[onClose];

    fetch(`/toggle_on_close/${id}`, {
      method: "POST",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error toggling on_close for sound ${name}: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(`Error toggling on_close for sound ${name}:`, error);
      });
    });

  /* If the play button is clicked, play the sound. Leave a placeholder for API work. */
  playButton.addEventListener("click", () => {
    console.log(`Playing sound: ${name}`);
    // Post this fetch
    fetch(`/play_on_device/${id}`, {
      method: "POST",
    })
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      })
      .catch(error => {
        console.error(`Error playing sound ${name}:`, error);
      });
  });
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

