const randomWord = async () => {
  const wordLength = Math.floor(Math.random() * 11) + 1;
  const word = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${wordLength}`
  ).then((res) => res.json());

  return word[0];
};

const state = {
  word: "",
};

const getWord = async () => {
  state.word = await randomWord();
  console.log(state);
};
