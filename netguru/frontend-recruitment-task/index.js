const state = {
  word: [],
  wrong: [],
  valid: [],
};

const hangmanParts = {
  1: {
    src: "./imgs/bar.png",
    className: "game_result__hangman__bar",
    modifier: null,
    alt: "bar",
  },
  2: {
    src: "./imgs/head.png",
    className: "game_result__hangman__head",
    modifier: null,
    alt: "head",
  },
  3: {
    src: "./imgs/neck.png",
    className: "game_result__hangman__neck",
    modifier: null,
    alt: "neck",
  },
  4: {
    src: "./imgs/corpus.png",
    className: "game_result__hangman__corpus",
    modifier: null,
    alt: "corpus",
  },
  5: {
    src: "./imgs/left-arm.png",
    className: "game_result__hangman__left-arm",
    modifier: null,
    alt: "left-arm",
  },
  6: {
    src: "./imgs/right-arm.png",
    className: "game_result__hangman__right-arm",
    modifier: null,
    alt: "right-arm",
  },
  7: {
    src: "./imgs/left-hand.png",
    className: "game_result__hangman__hand",
    modifier: null,
    alt: "left-hand",
  },
  8: {
    src: "./imgs/left-hand.png",
    className: "game_result__hangman__hand",
    modifier: "game_result__hangman__hand--right",
    alt: "right-hand",
  },
  9: {
    src: "./imgs/left-leg.png",
    className: "game_result__hangman__leg",
    modifier: null,
    alt: "left-leg",
  },
  10: {
    src: "./imgs/left-leg.png",
    className: "game_result__hangman__leg",
    modifier: "game_result__hangman__leg--right",
    alt: "right-leg",
  },
  11: {
    src: "./imgs/left-foot.png",
    className: "game_result__hangman__foot",
    modifier: null,
    alt: "left-foot",
  },
  12: {
    src: "./imgs/left-foot.png",
    className: "game_result__hangman__foot",
    modifier: "game_result__hangman__foot--right",
    alt: "right-foot",
  },
};

async function getWord() {
  const word = await fetch(`https://random-words-api.vercel.app/word/noun`)
    .then((res) => res.json())
    .then((word) => word[0].word);

  if (word.length <= 11) {
    // we have space for 11 letters
    state.word = word.toUpperCase().split("");
    changeCorrectLetterFieldColor(state);
    return;
  }
  getWord();
}

function changeCorrectLetterFieldColor({ word }) {
  const deleteAmount = correctLetterFields.length - word.length;
  correctLetterFields.splice(0, deleteAmount);
  correctLetterFields.forEach((el) => {
    el.classList.add("letters_container__letter--avalible");
  });
}

const missedLettersContainer = document.body.querySelector(
  ".game_result__missed__letters"
);

const correctLetterFields = [
  ...document.body.querySelectorAll(".letters_container__letter"),
];

const hangman = document.body.querySelector(".game_result__hangman");

window.addEventListener("keydown", (e) => {
  if (/^[A-Za-z]+$/.test(e.key) && e.key.length == 1) {
    checkLetter(e.key.toUpperCase(), state);
  }
  console.log(state, e.key.toUpperCase());
});

function checkLetter(letter, state) {
  const { word, wrong, valid } = state;
  if (!word.includes(letter) && !wrong.includes(letter)) {
    const partNumber = wrong.length + 1;
    hangman.append(createHangmanPart(hangmanParts[partNumber]));
    wrong.push(letter);
    missedLettersContainer.append(renderMissedLetter(letter));
  }

  if (word.includes(letter) && !valid.includes(letter)) {
    valid.push(letter);
    renderValidLetter(letter, word);
  }

  isGameOver(state);
}

function renderMissedLetter(letter) {
  const p = document.createElement("p");
  p.textContent = letter;
  return p;
}

function renderValidLetter(letter, word) {
  const letterIds = word.map((value, id) => {
    if (value === letter) return id;
  });

  correctLetterFields.forEach((el, id) => {
    if (letterIds.includes(id)) el.textContent = letter;
  });
}

function createHangmanPart(part) {
  const element = document.createElement("img");
  Object.assign(element, {
    src: part.src,
    className: part.className,
    alt: part.alt,
  });

  if (part.modifier) element.classList.add(part.modifier);

  return element;
}

function isGameOver(state) {
  const won = state.word.every((value) => {
    return state.valid.includes(value);
  });

  if (state.wrong.length >= 11 || won) {
    const modal = document.createElement("div");
    modal.className = "game_over";
    const gameOver = document.createElement("p");
    gameOver.textContent = "GAME OVER";
    const button = document.createElement("button");
    button.addEventListener("click", () => reset(state, modal));
    button.textContent = "NEW WORD";

    document.body.appendChild(modal);
    modal.appendChild(gameOver);
    modal.appendChild(button);
  }
}

function reset(state, modal) {
  state.wrong = [];
  state.valid = [];

  // set initial color of valid fields on reset
  correctLetterFields.forEach((el) => {
    el.classList.remove("letters_container__letter--avalible");
  });

  //clear hangman
  hangman.innerHTML = "";

  // clear wrong letter
  missedLettersContainer.innerHTML = "";

  // clear textContext in valid letter
  correctLetterFields.forEach((el) => (el.textContent = ""));

  getWord();
  modal.remove();
}
