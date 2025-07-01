// Creates keybindings for speeding up all video players on the page. This is useful for
// (1) skipping ads and (2) speeding up videos quicker than otherwise.

(() => {
  // --- Configuration ---
  const USE_SHIFT_KEY = false;
  const MODIFIER_KEY_CODE = USE_SHIFT_KEY ? 16 : 18; // 16 = Shift, 18 = Option/Alt
  const MAX_SPEED = 16;
  const SPEED_PRESETS = {
    192: 0.5, // ~
    49: 1, // 1
    50: 2, // 2
    51: 3, // 3
    52: 4, // 4
    53: 5, // 5
    54: 6, // 6
    55: 7, // 7
    56: 8, // 8
    57: 9, // 9
    48: 10, // 0
    81: 1.5, // q
    87: 2.5, // w
    69: 3.5, // e
    82: 4.5, // r
    84: 5.5, // t
    89: 6.5, // y
    85: 7.5, // u
    79: 9.5, // o
    80: 10.5, // p
    189: MAX_SPEED, // -
    187: MAX_SPEED, // =
  };

  // --- State ---
  let modifierPressed = false;
  let oldSpeed = 1;
  let newSpeed = 1;

  // --- Utility Functions ---
  function isCloseTo(num, target, epsilon = 0.001) {
    return Math.abs(num - target) < epsilon;
  }

  function lessThan10(num) {
    return num < 10 && !isCloseTo(num, 10);
  }

  function lessThanOrEqual10(num) {
    return num < 10 || isCloseTo(num, 10);
  }

  function greaterThanOrEqual10(num) {
    return num > 10 || isCloseTo(num, 10);
  }

  function displaySpeed(num) {
    return `${greaterThanOrEqual10(num) ? num.toFixed(0) : num.toFixed(1)}x`;
  }

  function removeAllElementsOfClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 1) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function getAllVideos() {
    return Array.from(document.getElementsByTagName("video"));
  }

  /*
   * Remove any existing keypress trackers, and add an element
   * with class "keypress_tracker" to display the current speed.
   */
  function showKeypressTracker(content) {
    removeAllElementsOfClass("keypress_tracker");
    const div = document.createElement("div");
    div.className = "keypress_tracker";
    div.innerHTML = content;
    document.body.appendChild(div);
    setTimeout(() => {
      div.style.opacity = 0;
    }, 1000);
    setTimeout(() => {
      if (div.parentNode) div.parentNode.removeChild(div);
    }, 2000);
  }

  function setPlaybackRateForAll(videos, rate) {
    const new_vids = getAllVideos(); // fuck yo old shi
    for (const vid of new_vids) {
      vid.playbackRate = rate;
    }
  }

  function handleSpeedChange(keyCode, oldSpeed) {
    if (keyCode === 74) {
      // j
      return oldSpeed - (lessThanOrEqual10(oldSpeed) ? 0.1 : 1);
    }
    if (keyCode === 75) {
      // k
      return oldSpeed + (lessThan10(oldSpeed) ? 0.1 : 1);
    }
    if (keyCode === 191) {
      // ?
      return oldSpeed;
    }
    if (SPEED_PRESETS.hasOwnProperty(keyCode)) {
      return SPEED_PRESETS[keyCode];
    }
    return null;
  }

  // --- Event Handlers ---
  function onKeyDown(e) {
    if (e.keyCode === MODIFIER_KEY_CODE) {
      modifierPressed = true;
      return;
    }

    if (!modifierPressed) {
      if (e.keyCode !== MODIFIER_KEY_CODE) {
        console.log("modifier not pressed");
      }
      return;
    }

    let validCommand = true;
    let videos = getAllVideos();
    oldSpeed = videos.length ? videos[0].playbackRate : 1;
    newSpeed = oldSpeed;

    if (e.keyCode === 32) {
      // Spacebar
      // Optionally implement pause/play toggle here if needed
      validCommand = false;
    } else {
      const calculatedSpeed = handleSpeedChange(e.keyCode, oldSpeed);
      if (calculatedSpeed !== null && calculatedSpeed !== oldSpeed) {
        newSpeed = calculatedSpeed;
      } else {
        validCommand = false;
      }
    }

    if (validCommand) {
      setPlaybackRateForAll(videos, newSpeed);
      showKeypressTracker(
        newSpeed !== MAX_SPEED ? displaySpeed(newSpeed) : "SKIP"
      );
      oldSpeed = newSpeed;
      console.log(`--- NEW PLAYBACK RATE: ${displaySpeed(newSpeed)} ---`);
    } else {
      showKeypressTracker("[Error]");
      console.log("--- KEYPRESS IGNORED ---");
    }
  }

  function onKeyUp(e) {
    if (e.keyCode === MODIFIER_KEY_CODE) {
      modifierPressed = false;
    }
  }

  // --- Register Event Listeners ---
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);

})();
