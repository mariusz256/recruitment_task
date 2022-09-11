const randomWord = async () => {
  const word = await fetch(
    `https://random-words-api.vercel.app/word/noun`
  ).then((res) => res.json());

  return word[0].word;
};

async function getWord() {
  const word = await randomWord();
  if (word.length <= 11) {
    // we have space for 11 letters
    state.word = word.toUpperCase();
    changeLetterFieldColor(word.length);
    return;
  }
  console.log(word.length);
  getWord();
}

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

const state = {
  word: "",
  wrong: [],
  valid: [],
};

const missedLettersContainer = document.body.querySelector(
  ".game_result__missed__letters"
);

const correctLetterFields = [
  ...document.body.querySelectorAll(".letters_container__letter"),
];

const hangman = document.body.querySelector(".game_result__hangman");

function changeLetterFieldColor(letterNumber) {
  const deleteAmount = correctLetterFields.length - letterNumber;
  correctLetterFields.splice(0, deleteAmount);
  correctLetterFields.forEach((el) => {
    el.classList.add("letters_container__letter--avalible");
  });
}

function insertMissedLetter(letter) {
  const p = document.createElement("p");
  p.textContent = letter;
  return p;
}

function inserdValidLetter(letter, answer) {
  const splitAnswer = answer.split("");
  const letterIds = splitAnswer.map((value, id) => {
    console.log(value, id);
    if (value === letter) return id;
  });

  console.log(letterIds);

  correctLetterFields.forEach((el, id) => {
    if (letterIds.includes(id)) el.textContent = letter;
  });
}

function createHangmanPart(part) {
  console.log(part);
  const element = document.createElement("img");
  Object.assign(element, {
    src: part.src,
    className: part.className,
    alt: part.alt,
  });

  if (part.modifier) element.classList.add(part.modifier);

  return element;
}

function renderHangmanPart(part) {
  hangman.append(createHangmanPart(hangmanParts[part]));
}

function checkLetter(letter, state) {
  if (!state.word.includes(letter) && !state.wrong.includes(letter)) {
    const partNumber = state.wrong.length + 1;
    renderHangmanPart(partNumber);
    state.wrong.push(letter);

    missedLettersContainer.append(insertMissedLetter(letter));
  }

  if (state.word.includes(letter) && !state.valid.includes(letter)) {
    state.valid.push(letter);
    inserdValidLetter(letter, state.word);
  }
}

window.addEventListener("keydown", (e) => {
  if (/^[A-Za-z]+$/.test(e.key) && e.key.length == 1) {
    checkLetter(e.key.toUpperCase(), state);
  }
  console.log(state, e.key.toUpperCase());
});
