(() => {
  const board = document.querySelector("[data-word-board]");
  if (!board) return;
  const reader = window.GermanReader;
  const custom = new URLSearchParams(location.search).get("custom") === "1" ? (() => {
    try { return JSON.parse(localStorage.getItem("wortweg-custom-set") || "null"); }
    catch (_) { return null; }
  })() : null;
  const customWords = new Set(custom?.words || []);
  const pool = reader.words.filter(entry => entry.l !== "name" && (!customWords.size || customWords.has(entry.w)));

  /* Fisher–Yates: the old comparator shuffle biased which words ever made the board. */
  const shuffle = items => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  const BOARD_SIZE = 48;
  let words = [];
  if (customWords.size) document.querySelector(".page-head p").textContent = `A focused board from ${custom.label || "your collected words"}. Reveal each answer and mark it honestly.`;

  const quizPanel = document.querySelector(".quiz-panel");
  const quizWord = document.querySelector("[data-quiz-word]");
  const quizAnswer = document.querySelector("[data-quiz-answer]");
  const reveal = document.querySelector("[data-reveal]");
  const knownButton = document.querySelector("[data-knew]");
  const learningButton = document.querySelector("[data-learning]");
  const finish = document.querySelector("[data-board-finish]");
  const finishCopy = document.querySelector("[data-board-finish-copy]");
  let current = null;
  let currentTile = null;

  const tiles = () => [...board.querySelectorAll(".tile")];
  const settled = tile => tile.classList.contains("known") || tile.classList.contains("learning");

  const refreshStats = () => {
    const all = tiles();
    const done = all.filter(settled).length;
    document.querySelector("[data-remaining-count]").textContent = all.length - done;
    document.querySelector("[data-known-count]").textContent = all.filter(tile => tile.classList.contains("known")).length;
    document.querySelector("[data-board-count]").textContent = all.length;
  };

  const studyLink = finish.querySelector("[data-board-study]");
  const checkFinished = () => {
    const all = tiles();
    if (!all.length || !all.every(settled)) return false;
    const known = all.filter(tile => tile.classList.contains("known")).length;
    const missed = words.filter(entry => window.WORTWEG.isLearning(entry.w));
    finishCopy.textContent = missed.length
      ? `You knew ${known} of ${all.length}. The other ${missed.length} ${missed.length === 1 ? "is" : "are"} saved as still learning.`
      : `You knew all ${all.length}. Deal another board or move on to a longer chapter.`;
    /* "Ready as a deck" has to actually hand the words over, or the promise is a lie:
       write the review set the cards page already knows how to read. */
    if (missed.length) {
      try { localStorage.setItem("wortweg-custom-set", JSON.stringify({ words: missed.map(entry => entry.w), label: "words from the board" })); }
      catch (_) {}
      studyLink.href = "cards.html?custom=1";
      studyLink.textContent = `Study those ${missed.length} as cards`;
      studyLink.hidden = false;
    } else {
      studyLink.hidden = true;
    }
    finish.hidden = false;
    quizPanel.hidden = true;
    finish.querySelector("[data-board-again]").focus();
    return true;
  };

  const pick = (entry, tile) => {
    currentTile?.classList.remove("current");
    current = entry; currentTile = tile; tile.classList.add("current");
    quizWord.textContent = reader.displayWord(entry);
    quizAnswer.textContent = "Say the meaning before you reveal it.";
    reveal.disabled = false; knownButton.disabled = true; learningButton.disabled = true;
  };

  const mark = value => {
    if (!current) return;
    window.WORTWEG.setState(current.w, value ? "known" : "learning");
    currentTile.classList.toggle("known", value);
    currentTile.classList.toggle("learning", !value);
    currentTile.classList.remove("current");
    quizAnswer.textContent = value ? "Marked as known. Choose another tile." : "Saved as still learning. Study it in Karteikarten → Still learning.";
    current = null; currentTile = null;
    quizWord.textContent = "Wähle ein Wort.";
    knownButton.disabled = true; learningButton.disabled = true; reveal.disabled = true;
    refreshStats();
    checkFinished();
  };

  const deal = () => {
    board.innerHTML = "";
    words = shuffle(pool).slice(0, BOARD_SIZE);
    words.forEach(entry => {
      const tile = document.createElement("button");
      tile.type = "button"; tile.className = "tile";
      tile.lang = "de";
      const state = window.WORTWEG.wordState(entry.w);
      tile.classList.toggle("known", state === "known");
      tile.classList.toggle("learning", state === "learning");
      tile.innerHTML = `${entry.w}<small>${entry.l}</small>`;
      tile.onclick = () => pick(entry, tile);
      board.appendChild(tile);
    });
    current = null; currentTile = null;
    quizWord.textContent = "Wähle ein Wort.";
    quizAnswer.textContent = "Choose any tile to begin.";
    reveal.disabled = true; knownButton.disabled = true; learningButton.disabled = true;
    finish.hidden = true;
    quizPanel.hidden = false;
    refreshStats();
    checkFinished();
  };

  /* Deliberately NOT registered as an audio control: revealing the meaning is the
     core loop, and gating it on speech let a missing German voice lock the board
     with no way to reveal and no way to mark. speak() already no-ops safely. */
  reveal.onclick = () => {
    if (!current) return;
    quizAnswer.textContent = reader.detail(current);
    reader.speak(current.a ? `${current.a} ${current.w}` : current.w);
    reveal.disabled = true; knownButton.disabled = false; learningButton.disabled = false;
  };
  const labelReveal = () => { reveal.textContent = reader.speechStatus() === "ok" ? "Reveal + hear" : "Reveal"; };
  labelReveal();
  document.addEventListener("wortweg-voices", labelReveal);
  knownButton.onclick = () => mark(true);
  learningButton.onclick = () => mark(false);
  finish.querySelector("[data-board-again]").onclick = deal;

  deal();
})();
