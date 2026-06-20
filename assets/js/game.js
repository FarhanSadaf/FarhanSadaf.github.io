(() => {
  const USER_GAME_CONFIG = {
    delayMs: 3000,
    selector: ".user-game-modal",
    userName: "Farhan",
    guestName: "You",
    promptTemplate: "Wanna play a game with {name}?",
    playButtonText: "Let's play",
    snakeCount: 4,
    inviteMaxWidth: 430,
    activeMaxWidth: 560,
    activeMaxHeight: 360
  };

  const EDGES = ["top", "right", "bottom", "left"];
  const SNAKE_DURATION_SECONDS = 4.2;
  const BOARD_CELL_COUNT = 9;
  const CENTER_CELL = 4;
  const CORNER_CELLS = [0, 2, 6, 8];
  const INVITE_ACTIVATION_DELAY_MS = 180;
  const ROUND_RESET_DELAY_MS = 1150;
  const USER_MOVE_DELAY_MS = 360;
  const GUEST_MARK = "X";
  const USER_MARK = "O";
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const WIN_LINE_STYLES = {
    "0-1-2": { x: "15%", y: "16.666%", length: "70%", angle: "0deg" },
    "3-4-5": { x: "15%", y: "50%", length: "70%", angle: "0deg" },
    "6-7-8": { x: "15%", y: "83.333%", length: "70%", angle: "0deg" },
    "0-3-6": { x: "16.666%", y: "15%", length: "70%", angle: "90deg" },
    "1-4-7": { x: "50%", y: "15%", length: "70%", angle: "90deg" },
    "2-5-8": { x: "83.333%", y: "15%", length: "70%", angle: "90deg" },
    "0-4-8": { x: "16.666%", y: "16.666%", length: "94%", angle: "45deg" },
    "2-4-6": { x: "83.333%", y: "16.666%", length: "94%", angle: "135deg" }
  };

  function promptText() {
    return USER_GAME_CONFIG.promptTemplate.replace("{name}", USER_GAME_CONFIG.userName);
  }

  function isGuestAddressedAsYou() {
    return USER_GAME_CONFIG.guestName.trim().toLowerCase() === "you";
  }

  function guestTurnText() {
    return isGuestAddressedAsYou()
      ? "Your move"
      : `${USER_GAME_CONFIG.guestName}'s move`;
  }

  function guestWinText() {
    return isGuestAddressedAsYou()
      ? "You win"
      : `${USER_GAME_CONFIG.guestName} wins`;
  }

  function userWinText() {
    return `${USER_GAME_CONFIG.userName} wins`;
  }

  function userThinkingText() {
    return `${USER_GAME_CONFIG.userName} thinking`;
  }

  function scoreText(scores) {
    return `${USER_GAME_CONFIG.userName}: ${scores.user} vs. ${USER_GAME_CONFIG.guestName}: ${scores.guest}`;
  }

  function emptyBoard() {
    return Array(BOARD_CELL_COUNT).fill("");
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function snakeDelays() {
    const count = Math.max(1, Number(USER_GAME_CONFIG.snakeCount) || 1);
    return Array.from({ length: count }, (_, index) => {
      const offset = -(SNAKE_DURATION_SECONDS / count) * index;
      return `${offset}s`;
    });
  }

  function injectStyles() {
    if (document.getElementById("userGameStyles")) return;

    const style = document.createElement("style");
    style.id = "userGameStyles";
    style.textContent = `
      .easter-egg-piece .user-game-button,
      .easter-egg-piece .user-game-button *,
      .easter-egg-piece .user-game-cell,
      .easter-egg-piece .user-game-cell *,
      .easter-egg-piece .user-game-play {
        pointer-events: auto !important;
      }

      .user-game-modal {
        display: grid;
        z-index: 10020;
        gap: 17px;
        width: min(90vw, ${USER_GAME_CONFIG.inviteMaxWidth}px);
        height: auto;
        min-height: 0;
        padding: 20px 22px 18px;
        border: 2px dashed var(--line-soft);
        border-radius: 24px;
        background: transparent;
        color: var(--text);
        overflow: hidden;
        animation: userGameFadeIn 1.45s ease-out both;
      }

      .user-game-modal.is-active {
        align-content: center;
        border-color: rgba(0, 0, 0, 0.42);
        background: rgba(8, 14, 22, 0.84);
        gap: 0;
        padding: 0;
      }

      html[data-theme="light"] .user-game-modal.is-active {
        background: rgba(63, 95, 134, 0.42);
      }

      .user-game-snake {
        position: absolute;
        z-index: 1;
        display: block;
        border-radius: 999px;
        opacity: 0;
        pointer-events: none !important;
        filter: drop-shadow(0 0 5px rgba(159, 183, 214, 0.48));
        animation-duration: ${SNAKE_DURATION_SECONDS}s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-delay: var(--snake-delay, 0s);
      }

      .user-game-snake-top,
      .user-game-snake-bottom {
        width: 82px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--accent-strong), var(--accent), transparent);
      }

      .user-game-snake-right,
      .user-game-snake-left {
        width: 2px;
        height: 82px;
        background: linear-gradient(180deg, transparent, var(--accent-strong), var(--accent), transparent);
      }

      .user-game-snake-top {
        top: -1px;
        left: -82px;
        animation-name: userGameSnakeTop;
      }

      .user-game-snake-right {
        top: -82px;
        right: -1px;
        animation-name: userGameSnakeRight;
      }

      .user-game-snake-bottom {
        right: -82px;
        bottom: -1px;
        animation-name: userGameSnakeBottom;
      }

      .user-game-snake-left {
        bottom: -82px;
        left: -1px;
        animation-name: userGameSnakeLeft;
      }

      .user-game-prompt {
        position: relative;
        z-index: 2;
        justify-self: center;
        max-width: 100%;
        margin: 0;
        font-family: "Press Start 2P", "Public Pixel", "Pixelify Sans", "Courier New", monospace;
        font-size: 0.64rem;
        font-weight: 400;
        line-height: 1.72;
        letter-spacing: 0;
        text-align: center;
        white-space: nowrap;
      }

      .user-game-button {
        position: relative;
        z-index: 2;
        justify-self: center;
        border: 1px solid var(--button-border);
        border-radius: 999px;
        padding: 8px 14px;
        background: rgba(16, 24, 34, 0.94);
        color: #eef2f6;
        cursor: pointer;
        font: 400 0.58rem/1.4 "Press Start 2P", "Public Pixel", "Pixelify Sans", "Courier New", monospace;
        letter-spacing: 0;
        touch-action: manipulation;
        animation: userGameButtonBlink 0.95s steps(2, end) infinite;
      }

      .user-game-button:hover,
      .user-game-button:focus-visible {
        border-color: var(--accent);
        outline: none;
      }

      .user-game-button:active,
      .user-game-button.is-clicked {
        transform: scale(0.96);
      }

      .user-game-play {
        position: relative;
        z-index: 2;
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 15px;
        width: 100%;
        height: 100%;
        padding: 28px;
      }

      .user-game-score {
        margin: 0;
        max-width: 100%;
        color: var(--text);
        font-family: "Press Start 2P", "Public Pixel", "Pixelify Sans", "Courier New", monospace;
        font-size: clamp(0.48rem, 1.25vw, 0.64rem);
        font-weight: 400;
        line-height: 1.75;
        letter-spacing: 0;
        text-align: center;
        text-shadow: 1px 0 currentColor;
      }

      .user-game-board {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(0, 1fr));
        gap: 8px;
        width: min(232px, 58vmin);
        aspect-ratio: 1;
        padding: 8px;
        border: 2px solid var(--accent);
        background:
          linear-gradient(90deg, transparent calc(33.333% - 1px), var(--line-soft) calc(33.333% - 1px), var(--line-soft) calc(33.333% + 1px), transparent calc(33.333% + 1px)),
          linear-gradient(90deg, transparent calc(66.666% - 1px), var(--line-soft) calc(66.666% - 1px), var(--line-soft) calc(66.666% + 1px), transparent calc(66.666% + 1px)),
          linear-gradient(0deg, transparent calc(33.333% - 1px), var(--line-soft) calc(33.333% - 1px), var(--line-soft) calc(33.333% + 1px), transparent calc(33.333% + 1px)),
          linear-gradient(0deg, transparent calc(66.666% - 1px), var(--line-soft) calc(66.666% - 1px), var(--line-soft) calc(66.666% + 1px), transparent calc(66.666% + 1px));
        box-shadow:
          0 0 0 2px rgba(159, 183, 214, 0.16),
          inset 0 0 0 3px rgba(0, 0, 0, 0.22);
        overflow: hidden;
      }

      .user-game-cell {
        appearance: none;
        -webkit-appearance: none;
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: rgba(0, 0, 0, 0.22);
        color: var(--accent-strong);
        cursor: pointer;
        font-family: "Press Start 2P", "Public Pixel", "Pixelify Sans", "Courier New", monospace;
        font-size: clamp(1.5rem, 7vmin, 2.5rem);
        line-height: 1;
        text-shadow:
          2px 0 currentColor,
          0 2px currentColor;
        touch-action: manipulation;
        overflow: hidden;
      }

      .user-game-cell:hover,
      .user-game-cell:focus-visible {
        background: rgba(159, 183, 214, 0.15);
        outline: 2px solid var(--accent);
        outline-offset: -2px;
      }

      .user-game-cell:disabled {
        cursor: default;
        opacity: 1;
        -webkit-text-fill-color: currentColor;
      }

      .user-game-cell.is-guest {
        color: #eef2f6;
      }

      .user-game-cell.is-user {
        color: var(--accent-strong);
      }

      .user-game-cell.is-win {
        background: rgba(159, 183, 214, 0.24);
        color: var(--accent-strong);
      }

      .user-game-win-line {
        position: absolute;
        z-index: 4;
        top: var(--win-y, 50%);
        left: var(--win-x, 50%);
        display: block;
        width: var(--win-length, 0);
        height: 8px;
        border-radius: 999px;
        background: repeating-linear-gradient(
          90deg,
          var(--accent-strong) 0 8px,
          var(--accent) 8px 14px
        );
        box-shadow:
          0 0 0 2px rgba(8, 14, 22, 0.32),
          0 0 14px rgba(159, 183, 214, 0.54);
        opacity: 0;
        pointer-events: none;
        transform: translateY(-50%) rotate(var(--win-angle, 0deg)) scaleX(0);
        transform-origin: left center;
      }

      .user-game-win-line.is-visible {
        animation: userGameWinLineDraw 620ms steps(9, end) both;
      }

      .user-game-status {
        min-height: 1.25em;
        margin: 0;
        color: var(--muted);
        font-family: "Press Start 2P", "Public Pixel", "Pixelify Sans", "Courier New", monospace;
        font-size: clamp(0.4rem, 1vw, 0.52rem);
        line-height: 1.7;
        letter-spacing: 0;
        text-align: center;
      }

      html[data-theme="light"] .user-game-cell {
        background: rgba(255, 255, 255, 0.12);
      }

      html[data-theme="light"] .user-game-cell.is-guest {
        color: var(--text);
      }

      @media (max-width: 560px) {
        .user-game-modal {
          width: min(90vw, ${USER_GAME_CONFIG.inviteMaxWidth}px);
          padding: 17px 13px;
          border-radius: 21px;
        }

        .user-game-prompt { font-size: 0.5rem; }
        .user-game-button { font-size: 0.5rem; }
        .user-game-play {
          gap: 12px;
          padding: 22px 18px;
        }
        .user-game-board {
          width: min(198px, 62vmin);
          gap: 6px;
          padding: 6px;
        }
      }

      @media (max-width: 380px) {
        .user-game-prompt { font-size: 0.43rem; }
      }

      @keyframes userGameFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes userGameSnakeTop {
        0% { left: -82px; opacity: 1; }
        24.99% { left: 100%; opacity: 1; }
        25%,
        100% { left: 100%; opacity: 0; }
      }

      @keyframes userGameSnakeRight {
        0%,
        24.99% { top: -82px; opacity: 0; }
        25% { top: -82px; opacity: 1; }
        49.99% { top: 100%; opacity: 1; }
        50%,
        100% { top: 100%; opacity: 0; }
      }

      @keyframes userGameSnakeBottom {
        0%,
        49.99% { right: -82px; opacity: 0; }
        50% { right: -82px; opacity: 1; }
        74.99% { right: 100%; opacity: 1; }
        75%,
        100% { right: 100%; opacity: 0; }
      }

      @keyframes userGameSnakeLeft {
        0%,
        74.99% { bottom: -82px; opacity: 0; }
        75% { bottom: -82px; opacity: 1; }
        99.99% { bottom: 100%; opacity: 1; }
        100% { bottom: 100%; opacity: 0; }
      }

      @keyframes userGameButtonBlink {
        0%,
        49.99% {
          background: rgba(16, 24, 34, 0.94);
          box-shadow: 0 0 0 rgba(159, 183, 214, 0);
        }
        50%,
        100% {
          background: rgba(44, 61, 82, 0.98);
          box-shadow: 0 0 16px rgba(159, 183, 214, 0.34);
        }
      }

      @keyframes userGameWinLineDraw {
        0% {
          opacity: 0;
          transform: translateY(-50%) rotate(var(--win-angle, 0deg)) scaleX(0);
        }
        18% { opacity: 1; }
        100% {
          opacity: 1;
          transform: translateY(-50%) rotate(var(--win-angle, 0deg)) scaleX(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createSnakeSegment(edge, delay) {
    const segment = document.createElement("span");
    segment.className = `user-game-snake user-game-snake-${edge}`;
    segment.setAttribute("aria-hidden", "true");
    segment.style.setProperty("--snake-delay", delay);
    return segment;
  }

  function appendSnakes(modal) {
    snakeDelays().forEach(delay => {
      EDGES.forEach(edge => {
        modal.appendChild(createSnakeSegment(edge, delay));
      });
    });
  }

  function winningInfo(board) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { mark: board[a], line };
      }
    }

    return null;
  }

  function availableMoves(board) {
    return board.reduce((moves, mark, index) => {
      if (!mark) moves.push(index);
      return moves;
    }, []);
  }

  function findLineMove(board, mark) {
    for (const line of WIN_LINES) {
      const marks = line.map(index => board[index]);
      const emptyIndex = marks.indexOf("");
      if (emptyIndex !== -1 && marks.filter(value => value === mark).length === 2) {
        return line[emptyIndex];
      }
    }

    return null;
  }

  function chooseUserMove(board) {
    const winningMove = findLineMove(board, USER_MARK);
    if (winningMove !== null) return winningMove;

    const blockingMove = findLineMove(board, GUEST_MARK);
    if (blockingMove !== null) return blockingMove;

    if (!board[CENTER_CELL]) return CENTER_CELL;

    const corners = CORNER_CELLS.filter(index => !board[index]);
    if (corners.length) return randomItem(corners);

    const moves = availableMoves(board);
    return moves.length ? randomItem(moves) : null;
  }

  function createGameElement() {
    const state = {
      board: emptyBoard(),
      scores: { user: 0, guest: 0 },
      locked: false,
      resetTimer: null
    };

    const root = document.createElement("div");
    root.className = "user-game-play";

    const score = document.createElement("p");
    score.className = "user-game-score";
    root.appendChild(score);

    const boardElement = document.createElement("div");
    boardElement.className = "user-game-board";
    boardElement.setAttribute("role", "grid");
    boardElement.setAttribute("aria-label", "Tic-tac-toe board");
    root.appendChild(boardElement);

    const winLine = document.createElement("span");
    winLine.className = "user-game-win-line";
    winLine.setAttribute("aria-hidden", "true");
    boardElement.appendChild(winLine);

    const status = document.createElement("p");
    status.className = "user-game-status";
    status.setAttribute("aria-live", "polite");
    root.appendChild(status);

    const cells = Array.from({ length: BOARD_CELL_COUNT }, (_, index) => {
      const cell = document.createElement("button");
      cell.className = "user-game-cell";
      cell.type = "button";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Place ${GUEST_MARK} in cell ${index + 1}`);
      cell.addEventListener("pointerdown", event => event.stopPropagation());
      cell.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        playHumanMove(index);
      });
      boardElement.appendChild(cell);
      return cell;
    });

    boardElement.addEventListener("pointerdown", event => event.stopPropagation());

    function updateScore() {
      score.textContent = scoreText(state.scores);
    }

    function setStatus(message) {
      status.textContent = message;
    }

    function updateWinLine(winningLine) {
      winLine.classList.remove("is-visible");

      if (!winningLine.length) return;

      const config = WIN_LINE_STYLES[winningLine.join("-")];
      if (!config) return;

      winLine.style.setProperty("--win-x", config.x);
      winLine.style.setProperty("--win-y", config.y);
      winLine.style.setProperty("--win-length", config.length);
      winLine.style.setProperty("--win-angle", config.angle);
      void winLine.offsetWidth;
      winLine.classList.add("is-visible");
    }

    function render(winningLine = []) {
      const winners = new Set(winningLine);
      cells.forEach((cell, index) => {
        const mark = state.board[index];
        cell.textContent = mark;
        cell.disabled = state.locked || Boolean(mark);
        cell.classList.toggle("is-guest", mark === GUEST_MARK);
        cell.classList.toggle("is-user", mark === USER_MARK);
        cell.classList.toggle("is-win", winners.has(index));
      });
      updateWinLine(winningLine);
    }

    function resetRound(message = guestTurnText()) {
      state.board = emptyBoard();
      state.locked = false;
      state.resetTimer = null;
      setStatus(message);
      render();
    }

    function finishRound(info) {
      state.locked = true;

      if (info?.mark === GUEST_MARK) {
        state.scores.guest += 1;
        setStatus(guestWinText());
      } else if (info?.mark === USER_MARK) {
        state.scores.user += 1;
        setStatus(userWinText());
      } else {
        setStatus("Draw");
      }

      updateScore();
      render(info?.line || []);
      window.clearTimeout(state.resetTimer);
      state.resetTimer = window.setTimeout(() => resetRound(), ROUND_RESET_DELAY_MS);
    }

    function checkRoundEnd() {
      const info = winningInfo(state.board);
      if (info) {
        finishRound(info);
        return true;
      }

      if (!availableMoves(state.board).length) {
        finishRound(null);
        return true;
      }

      return false;
    }

    function playUserMove() {
      const move = chooseUserMove(state.board);
      if (move !== null) state.board[move] = USER_MARK;
      state.locked = false;

      if (!checkRoundEnd()) {
        setStatus(guestTurnText());
        render();
      }
    }

    function playHumanMove(index) {
      if (state.locked || state.board[index]) return;

      window.clearTimeout(state.resetTimer);
      state.board[index] = GUEST_MARK;
      render();

      if (checkRoundEnd()) return;

      state.locked = true;
      setStatus(userThinkingText());
      render();
      window.setTimeout(playUserMove, USER_MOVE_DELAY_MS);
    }

    updateScore();
    resetRound();
    return root;
  }

  function createElement() {
    injectStyles();

    const modal = document.createElement("section");
    modal.className = "easter-egg-piece user-game-modal";

    appendSnakes(modal);

    const text = document.createElement("p");
    text.className = "user-game-prompt";
    text.textContent = promptText();
    modal.appendChild(text);

    const button = document.createElement("button");
    button.className = "user-game-button";
    button.type = "button";
    button.textContent = USER_GAME_CONFIG.playButtonText;
    modal.appendChild(button);

    return modal;
  }

  function activate(modal, onStart) {
    modal.classList.add("is-active");
    modal.querySelectorAll(".user-game-prompt, .user-game-button").forEach(node => node.remove());
    if (!modal.querySelector(".user-game-play")) {
      modal.appendChild(createGameElement());
    }
    let event;
    let windowEvent;

    if (typeof CustomEvent === "function") {
      event = new CustomEvent("usergame:start", { bubbles: true });
      windowEvent = new CustomEvent("usergame:start", { detail: { modal } });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("usergame:start", true, false, {});
      windowEvent = document.createEvent("CustomEvent");
      windowEvent.initCustomEvent("usergame:start", false, false, { modal });
    }

    modal.dispatchEvent(event);
    window.dispatchEvent(windowEvent);
    if (typeof onStart === "function") onStart();
  }

  function attachControls(modal, onStart) {
    const button = modal.querySelector(".user-game-button");
    if (!button) return;

    button.addEventListener("pointerdown", event => {
      event.stopPropagation();
    });

    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.add("is-clicked");
      window.setTimeout(() => activate(modal, onStart), INVITE_ACTIVATION_DELAY_MS);
    });
  }

  window.UserGame = {
    config: USER_GAME_CONFIG,
    delayMs: USER_GAME_CONFIG.delayMs,
    selector: USER_GAME_CONFIG.selector,
    createElement,
    attachControls
  };
})();
