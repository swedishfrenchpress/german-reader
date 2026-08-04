(() => {
  const board = document.querySelector("[data-word-board]");
  if (!board) return;
  const reader = window.GermanReader;
  const words = reader.words.filter(entry => entry.l !== "name").sort(() => Math.random() - .5).slice(0, 48);
  const quizWord = document.querySelector("[data-quiz-word]");
  const quizAnswer = document.querySelector("[data-quiz-answer]");
  const reveal = document.querySelector("[data-reveal]");
  const knownButton = document.querySelector("[data-knew]");
  const learningButton = document.querySelector("[data-learning]");
  let current = null;
  let currentTile = null;

  const refreshStats = () => {
    document.querySelector("[data-known-count]").textContent = window.WORTWEG.known().length;
    document.querySelector("[data-starred-count]").textContent = window.WORTWEG.starred().length;
    document.querySelector("[data-board-count]").textContent = words.length;
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
    window.WORTWEG.setKnown(current.w, value);
    currentTile.classList.toggle("known", value);
    currentTile.classList.toggle("learning", !value);
    currentTile.classList.remove("current");
    quizAnswer.textContent = value ? "Marked as known. Choose another tile." : "Added to your learning path. Choose another tile.";
    current = null; knownButton.disabled = true; learningButton.disabled = true; reveal.disabled = true;
    refreshStats();
  };

  words.forEach(entry => {
    const tile = document.createElement("button");
    tile.type = "button"; tile.className = "tile";
    tile.classList.toggle("known", window.WORTWEG.isKnown(entry.w));
    tile.innerHTML = `${entry.w}<small>${entry.l}</small>`;
    tile.onclick = () => pick(entry, tile);
    board.appendChild(tile);
  });
  reveal.onclick = () => {
    if (!current) return;
    quizAnswer.textContent = reader.detail(current);
    reader.speak(current.a ? `${current.a} ${current.w}` : current.w);
    reveal.disabled = true; knownButton.disabled = false; learningButton.disabled = false;
  };
  knownButton.onclick = () => mark(true);
  learningButton.onclick = () => mark(false);
  refreshStats();
})();
