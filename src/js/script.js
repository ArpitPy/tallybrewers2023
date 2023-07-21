const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  tryAgainBtn = document.querySelector(".content button"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span");

const timeLimitSelect = document.getElementById("time-limit");
const difficulty = document.getElementById("difficulty-level");

let level = difficulty.value;
difficulty.addEventListener("input", () => {
  level = difficulty.value;
  resetGame();
});

// Set the initial time limit
let maxTime = parseInt(timeLimitSelect.value),
  timeLeft = maxTime;
timeLimitSelect.addEventListener("change", function () {
  maxTime = parseInt(timeLimitSelect.value);
  timeTag.innerText = maxTime;
  timeLeft = maxTime;
});

let timer = maxTime,
  charIndex = (mistakes = isTyping = 0),
  len = 0;

function loadParagraph() {
  let ranIndex = 0;
  switch (level) {
    case "easy":
      ranIndex = Math.floor(Math.random() * 5); //0 to 4
      break;
    case "moderate":
      ranIndex = Math.floor(Math.random() * 5 + 5); //5 to 9
      break;
    case "difficult":
      ranIndex = Math.floor(Math.random() * 5 + 10); //10 to 14
      break;
  }
  //const ranIndex = Math.floor(Math.random() * text.length);
  typingText.innerHTML = "";
  len = text[ranIndex].length;
  text[ranIndex].split("").forEach((char) => {
    let span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
    mistakeTag.innerText = Math.floor(100 - (mistakes / charIndex) * 100);
  } else {
    clearInterval(timer);
    inpField.value = "";
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
