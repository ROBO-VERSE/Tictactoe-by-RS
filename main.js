// ========================= // Game State & Constants // =========================
const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let playerXName = localStorage.getItem("playerX") || "Player X";
let playerOName = localStorage.getItem("playerO") || "Player O";
let score = JSON.parse(localStorage.getItem("score")) || { X: 0, O: 0, draw: 0 };
let history = JSON.parse(localStorage.getItem("history")) || [];
let language = localStorage.getItem("language") || "en";
let timerEnabled = true;
let aiEnabled = false;
let aiDifficulty = "easy";
let timeLeft = 10;
let timerInterval;
let darkMode = false;
let secretCode = "openai";
let secretInput = "";

const languages = {
  en: { win: "wins!", draw: "It's a draw!", turn: "'s turn" },
  bn: { win: "জিতেছে!", draw: "ড্র!", turn: "এর পালা" },
  es: { win: "gana!", draw: "¡Empate!", turn: "turno de" }
};

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status-text");
const restartBtn = document.querySelector(".restart");
const resetScoreBtn = document.querySelector(".reset-score");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const scoreBoard = document.querySelector(".scoreboard");
const themeToggle = document.getElementById("themeToggle");
const langSelect = document.getElementById("langSelect");
const musicToggle = document.getElementById("musicToggle");
const memeModeBtn = document.getElementById("memeMode");

// ========================= // Utility Functions // =========================
function updateStatus(msg) {
  statusText.textContent = msg;
}

function saveToLocal() {
  localStorage.setItem("score", JSON.stringify(score));
  localStorage.setItem("playerX", playerXName);
  localStorage.setItem("playerO", playerOName);
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("language", language);
}

function updateScoreBoard() {
  scoreBoard.innerHTML = `
    <p>${playerXName}: ${score.X}</p>
    <p>${playerOName}: ${score.O}</p>
    <p>Draws: ${score.draw}</p>`;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "draw";
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  const turnText = `${currentPlayer === "X" ? playerXName : playerOName}${languages[language].turn}`;
  updateStatus(turnText);
  
  if (aiEnabled && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(idx => idx !== null);
  let move;

  if (aiDifficulty === "hard") {
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else {
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  handleCellClick({ target: cells[move] });
}

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute("data-index"));
  
  if (board[index] !== "" || !isGameActive) return;
  
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  
  const result = checkWinner();
  if (result) {
    isGameActive = false;
    if (result === "draw") {
      score.draw++;
      updateStatus(languages[language].draw);
    } else {
      score[result]++;
      updateStatus(`${currentPlayer === "X" ? playerXName : playerOName} ${languages[language].win}`);
    }
    history.unshift(result);
    if (history.length > 5) history.pop();
    updateScoreBoard();
    saveToLocal();
    return;
  }
  switchPlayer();
}

function restartGame() {
  board.fill("");
  cells.forEach(c => c.textContent = "");
  currentPlayer = "X";
  isGameActive = true;
  updateStatus(`${playerXName}${languages[language].turn}`);
}

function toggleThemeMode(mode) {
  document.body.classList.remove("dark", "cute", "horror", "meme");
  document.body.classList.add(mode);
  darkMode = mode === "dark";
}

// ========================= // Event Listeners // =========================
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
resetScoreBtn.addEventListener("click", () => {
  score = { X: 0, O: 0, draw: 0 };
  history = [];
  saveToLocal();
  updateScoreBoard();
});

playerXInput.addEventListener("input", () => {
  playerXName = playerXInput.value;
  saveToLocal();
});

playerOInput.addEventListener("input", () => {
  playerOName = playerOInput.value;
  saveToLocal();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkMode = !darkMode;
});

langSelect.addEventListener("change", () => {
  language = langSelect.value;
  saveToLocal();
  restartGame();
});

musicToggle.addEventListener("click", () => {
  // Add toggle music functionality
});

memeModeBtn.addEventListener("click", () => {
  // Add funny meme effects
});

// ========================= // Init // =========================
playerXInput.value = playerXName;
playerOInput.value = playerOName;
updateScoreBoard();
updateStatus(`${playerXName}${languages[language].turn}`);
restartGame();