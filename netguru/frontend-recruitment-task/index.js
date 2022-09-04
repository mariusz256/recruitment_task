const randomWord = async () => {
  const word = await fetch(
    `https://random-words-api.vercel.app/word/noun`
  ).then((res) => res.json());

  return word[0].word;
};

const state = {
  word: "",
};

const getWord = async () => {
  const word = await randomWord();
  if (word.length <= 11) {
    // we have space for 11 letters
    state.word = word;
    return;
  }
  return getWord();
};

window.addEventListener("keydown", (e) => {
  if (/^[A-Za-z]+$/.test(e.key)) {
    console.log(e);
  }
});
