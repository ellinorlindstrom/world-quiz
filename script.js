import countries from "./countries.js";
//--------------------------------------------------------------------------

let countryImgEl = document.querySelector("#country-image");
const gameEl = document.querySelector("#game-el");
const welcomeEl = document.querySelector(".welcome-el");
const resultEl = document.querySelector("#result-el");
const playAgainBtn = document.querySelector("#play-again-btn");
const optionEl1 = document.querySelector(".option1");
const optionEl2 = document.querySelector(".option2");
const optionEl3 = document.querySelector(".option3");
const optionEl4 = document.querySelector(".option4");
const nextBtn = document.querySelector("#next-btn");
const resultBtn = document.querySelector("#result-btn");
const h1El = document.querySelector("h1");
const score = document.querySelector("#total-score");
const roundScoreEl = document.querySelector("#round-score-el");
const resultImgEl = document.querySelector("#result-image");
const resultTextEl = document.querySelector("#result-text");

const hideElement = (element) => element.classList.add("hide");
const viewElement = (element) => element.classList.remove("hide");

let totalQuestions = [];
let questionCount = 0;
let correctAnswerGlobal = "";
let totalScoreCounter = 0;
let roundCounter = 0;

//--------------------------------------------------------------------------

const shuffledArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

//funktion för att blanda svarsalternativen, lägga till 3 felaktiga svar och få fram det korrekta svaret.
const countriesWithShuffledAnswers = shuffledArray(countries).map((item) => {
  const notCorrect = shuffledArray(countries)
    .filter((country) => country.id !== item.id)
    .splice(0, 3);

  return {
    ...item,
    notCorrect,
  };
});
//rendera ut ny fråga lägga in rätt och fel svar i svarsalternativen, samt bild att visa.
const renderNewQuestion = () => {
  const currentQuestion = totalQuestions[questionCount];
  const correctAnswer = currentQuestion.name;
  correctAnswerGlobal = correctAnswer;
  const incorrectAnswers = currentQuestion.notCorrect.map(
    (country) => country.name
  );
  const allOptions = shuffledArray([...incorrectAnswers, correctAnswer]);

  [optionEl1, optionEl2, optionEl3, optionEl4].forEach((el, index) => {
    el.innerHTML = allOptions[index];
  });
  countryImgEl.src = currentQuestion.image;
};

//--------------------------------------------------------------------------

//startGame funktion för att dölja välkomstsidan och visa spelsidan.
const startGame = () => {
  hideElement(welcomeEl);
  viewElement(gameEl);
  hideElement(resultBtn);
  hideHeader();};
//--------------------------------------------------------------------------

//funktion för att dölja "next" knapp och visa "result" knapp efter sista frågan.

const stopGame = () => {
  hideElement(nextBtn);
  viewElement(resultBtn);
};

// funktion för att rendera ut ny header under spelets gång.
const hideHeader = () => {
  h1El.textContent = "";
};

//funktion för att visa totala poängen efter varje fråga samt hur många frågor som är besvarade.
const totalScore = () => {
  score.innerHTML = `Your total score is ${totalScoreCounter} out of ${totalQuestions.length} | Questions answered ${questionCount}.`;
};

// Kolla vilka svarsalternativ som är korrekta och inkorrekta, samt lägga till klass för att visa detta med röd/grön ram.
const checkAnswer = (e) => {
  questionCount++;
  const target = e.target.textContent;
  e.stopPropagation();
  const incorrectBtns = () => {
    [optionEl1, optionEl2, optionEl3, optionEl4]
      .filter((item) => item.textContent !== correctAnswerGlobal)
      .forEach((item) => item.classList.add("incorrect-answer"));
  };
  if (target === correctAnswerGlobal) {
    totalScoreCounter++;
    e.target.classList.add("correct-answer");
    incorrectBtns();
  } else {
    const correctBtn = [optionEl1, optionEl2, optionEl3, optionEl4]
      .filter((item) => item.textContent === correctAnswerGlobal)
      .forEach((item) => item.classList.add("correct-answer"));
    incorrectBtns();
  } //fortsätt visa "next" knapp så länge det finns fler frågor att besvara
  if (questionCount !== totalQuestions.length) {
    viewElement(nextBtn);
    // avaktivera knappar efter sista frågan.
  } else {
    stopGame();
  }
  [optionEl1, optionEl2, optionEl3, optionEl4].forEach((el, index) => {
    el.disabled = true;
  });

  totalScore();
};

optionEl1.addEventListener("click", (e) => {
  checkAnswer(e);
});

optionEl2.addEventListener("click", (e) => {
  checkAnswer(e);
});

optionEl3.addEventListener("click", (e) => {
  checkAnswer(e);
});

optionEl4.addEventListener("click", (e) => {
  checkAnswer(e);
});

//knappar för att välja antal frågor
document.querySelector(".btn-10").addEventListener("click", () => {
  totalQuestions = shuffledArray(countriesWithShuffledAnswers).slice(0, 10);
  renderNewQuestion();
  startGame();
});

document.querySelector(".btn-20").addEventListener("click", () => {
  totalQuestions = shuffledArray(countriesWithShuffledAnswers).slice(0, 20);
  renderNewQuestion();
  startGame();
});

document.querySelector(".btn-30").addEventListener("click", () => {
  totalQuestions = shuffledArray(countriesWithShuffledAnswers).slice(0, 30);
  renderNewQuestion();
  startGame();
});

document.querySelector(".btn-all").addEventListener("click", () => {
  totalQuestions = shuffledArray(countriesWithShuffledAnswers);
  renderNewQuestion();
  startGame();
});

const enableBtns = () => {
  [optionEl1, optionEl2, optionEl3, optionEl4].forEach((el, index) => {
    el.disabled = false;
  });
};
//knapp för att gå vidare till nästa fråga. Döljer "next" knapp och renderar ny fråga.
nextBtn.addEventListener("click", () => {
  clearStatusClass(optionEl1, optionEl2, optionEl3, optionEl4);
  renderNewQuestion();
  hideElement(nextBtn);
  enableBtns();
});

//funktion för att rensa rätt/fel klasser från svarsalternativ.
const clearStatusClass = (...targets) => {
  targets.forEach((target) => {
    target.classList.remove("incorrect-answer");
    target.classList.remove("correct-answer");
  });
};

//knapp för att visa resultatet efter sista frågan samt passande mr bean gif.
resultBtn.addEventListener("click", () => {
  hideElement(gameEl);
  viewElement(resultEl);
  roundCounter++;
  roundScoreEl.innerHTML += ` Round ${roundCounter}:  ${totalScoreCounter} / ${totalQuestions.length} <br>`;
  if (totalScoreCounter === totalQuestions.length) {
    resultImgEl.src = "images/mr-bean-celebration.gif";
    resultTextEl.textContent = ` You got them all right 🎂`;
  } else if (totalScoreCounter > totalQuestions.length / 2) {
    resultImgEl.src = "images/mr-bean-ok.gif";
    resultTextEl.textContent = ` You did pretty well 🐍`;
  } else if (
    totalScoreCounter < totalQuestions.length / 2 &&
    totalScoreCounter !== 1 &&
    totalScoreCounter !== 0
  ) {
    resultImgEl.src = "images/mr-bean-frustrated.gif";
    resultTextEl.textContent = ` You need to study more 🦦`;
  } else {
    resultImgEl.src = "images/mr-bean-sad.gif";
    resultTextEl.textContent = ` You didn't do well at all 🚽`;
  }

  console.log("totalQuestions.length:", totalQuestions.length);
  console.log("totalScoreCounter:", totalScoreCounter);
});

//knapp för att återställa resultat och börja om från början.
const resetGame = () => {
  questionCount = 0;
  totalScoreCounter = 0;
  totalQuestions = [];
  totalScore();
  [optionEl1, optionEl2, optionEl3, optionEl4].forEach((el) => {
    el.disabled = false;
  });
};
// knapp för att återgå till välkomstsidan och börja om från början.
playAgainBtn.addEventListener("click", () => {
  hideElement(resultEl);
  viewElement(welcomeEl);
  clearStatusClass(optionEl1, optionEl2, optionEl3, optionEl4);
  resetGame();
});
//--------------------------------------------------------------------------
