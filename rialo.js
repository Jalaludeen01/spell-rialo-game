const menu = document.getElementById("menu");
const game = document.getElementById("game");
const endScreen = document.getElementById("end-screen");
const endMessage = document.getElementById("end-message");
const restartBtn = document.getElementById("restart-btn");
const rialoProgress = document.getElementById("rialo-progress");
const wordContainer = document.getElementById("word-container");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const livesDisplay = document.getElementById("lives");

let secretWord = "";
let guessedLetters = [];
let guessedHistory = new Set(); 
let lives = 5;
let rialoLetters = ["R", "I", "A", "L", "O"];
let rialoProgressState = 0;

async function loadWords() {
  const response = await fetch("words.txt");
  const words = await response.text();
  return words.split("\n").map(w => w.trim().toUpperCase());
}

async function startGame(difficulty) {
  const words = await loadWords();
  secretWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = Array(secretWord.length).fill("");
  guessedHistory.clear();
  rialoProgressState = 0;
  rialoProgress.textContent = "_ _ _ _ _";

  if (difficulty === "easy") lives = 10;
  else if (difficulty === "medium") lives = 7;
  else lives = 5;

  updateDisplay();
  menu.classList.add("hidden");
  game.style.display = "block";
}

function updateDisplay() {
  wordContainer.innerHTML = "";
  guessedLetters.forEach(letter => {
    const div = document.createElement("div");
    div.classList.add("letter-box");
    div.textContent = letter ? letter : "";
    wordContainer.appendChild(div);
  });
  livesDisplay.textContent = `Lives: ${lives}`;
}

function handleGuess() {
  const guess = guessInput.value.toUpperCase();
  guessInput.value = "";
  if (!guess.match(/^[A-Z]$/)) return;

  
  if (guessedHistory.has(guess)) return;
  guessedHistory.add(guess);

  let correctGuess = false;

  secretWord.split("").forEach((l, i) => {
    if (l === guess) {
      guessedLetters[i] = guess;
      correctGuess = true;
    }
  });

  if (correctGuess) {
    rialoProgressState = Math.min(rialoProgressState + 1, rialoLetters.length);
    rialoProgress.textContent = rialoLetters.slice(0, rialoProgressState).join(" ");
  } else {
    lives = Math.max(lives - 1, 0);
  }

  updateDisplay();

  if (guessedLetters.join("") === secretWord) {
    endGame("win");
  } else if (lives <= 0) {
    endGame("lose");
  }
}

function endGame(result) {
  game.style.display = "none";
  endScreen.classList.remove("hidden");

  if (result === "win") {
    endMessage.textContent = `You Win! You have successfully spelt RIALO!`;
  } else {
    endMessage.textContent = `Game Over. Rethink, Rebuild. The word was: ${secretWord}`;
  }
}


restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  menu.classList.remove("hidden");
});

guessBtn.addEventListener("click", handleGuess);
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => startGame(btn.dataset.level));
});

guessInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    handleGuess();
  }
});
