const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const winStreakEl = document.getElementById("winStreak");
const unbeatenStreakEl = document.getElementById("unbeatenStreak");
const difficultyEl = document.getElementById("difficulty");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let winStreak = 0;
let unbeatenStreak = 0;

function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = val || "";
    cell.addEventListener("click", () => handleCellClick(i));
    boardEl.appendChild(cell);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index]) return;
  board[index] = currentPlayer;
  drawBoard();
  if (checkWinner(currentPlayer)) {
    statusEl.innerText = `Player ${currentPlayer} wins!`;
    updateStreaks(currentPlayer);
    gameActive = false;
    return;
  }
  if (!board.includes(null)) {
    statusEl.innerText = "It's a draw!";
    unbeatenStreak++;
    gameActive = false;
    updateStats();
    return;
  }
  currentPlayer = "O";
  setTimeout(aiMove, 500);
}

function aiMove() {
  const level = difficultyEl.value;
  let move;
  switch (level) {
    case "easy": move = easyMove(); break;
    case "medium": move = mediumMove(); break;
    case "hard": move = bestMove(); break;
  }
  if (move != null) board[move] = "O";
  drawBoard();
  if (checkWinner("O")) {
    statusEl.innerText = "AI wins!";
    winStreak = 0;
    gameActive = false;
    updateStats();
    return;
  }
  if (!board.includes(null)) {
    statusEl.innerText = "It's a draw!";
    unbeatenStreak++;
    gameActive = false;
    updateStats();
    return;
  }
  currentPlayer = "X";
}

function easyMove() {
  const empty = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      if (checkWinner("O")) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "X";
      if (checkWinner("X")) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  return easyMove();
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner("O", boardState)) return 10 - depth;
  if (checkWinner("X", boardState)) return depth - 10;
  if (!boardState.includes(null)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === null) {
        boardState[i] = "O";
        let eval = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === null) {
        boardState[i] = "X";
        let eval = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function checkWinner(player, boardState = board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(index => boardState[index] === player));
}

function updateStreaks(winner) {
  if (winner === "X") {
    winStreak++;
    unbeatenStreak++;
  } else {
    winStreak = 0;
    unbeatenStreak = 0;
  }
  updateStats();
}

function updateStats() {
  winStreakEl.innerText = winStreak;
  unbeatenStreakEl.innerText = unbeatenStreak;
}

function resetGame() {
  board = Array(9).fill(null);
  gameActive = true;
  currentPlayer = "X";
  statusEl.innerText = "";
  drawBoard();
}

drawBoard();