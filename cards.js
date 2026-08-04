(() => {
  const card = document.querySelector("[data-flashcard]");
  if (!card) return;
  const reader = window.GermanReader;
  const levelButtons = [...document.querySelectorAll("[data-level]")];
  const sourceButtons = [...document.querySelectorAll("[data-source]")];
  let levels = new Set(["A1", "A2", "B1"]);
  let source = "all";
  const custom = new URLSearchParams(location.search).get("custom") === "1" ? (() => {
    try { return JSON.parse(localStorage.getItem("wortweg-custom-set") || "null"); }
    catch (_) { return null; }
  })() : null;
  const customWords = new Set(custom?.words || []);
  if (customWords.size) {
    source = "custom";
    const customButton = sourceButtons[0];
    customButton.dataset.source = "custom";
    customButton.textContent = custom.label || "Course review";
    sourceButtons.forEach(button => button.classList.toggle("on", button === customButton));
  }
  let deck = [];
  let index = 0;
  let missed = [];

  const buildDeck = () => {
    let next = reader.words.filter(entry => levels.has(entry.l));
    if (source === "custom") next = next.filter(entry => customWords.has(entry.w));
    if (source === "starred") next = next.filter(entry => window.WORTWEG.isStarred(entry.w));
    if (source === "seen") next = next.filter(entry => window.WORTWEG.isSeen(entry.w));
    deck = next.sort(() => Math.random() - .5);
    index = 0; missed = [];
    render();
  };

  const render = () => {
    const empty = document.querySelector("[data-empty]");
    const stage = document.querySelector("[data-card-stage]");
    if (!deck.length) { empty.hidden = false; stage.hidden = true; return; }
    empty.hidden = true; stage.hidden = false;
    if (index >= deck.length) {
      document.querySelector("[data-card-count]").textContent = `${deck.length} / ${deck.length}`;
      card.innerHTML = `<div><div class="flashcard-word" lang="de">Geschafft.</div><div class="flashcard-detail" style="display:block">You finished ${deck.length} cards. ${missed.length ? `${missed.length} need another look.` : "Every card was known."}</div><div class="flashcard-hint">Change a filter to build another deck</div></div>`;
      card.classList.add("flipped");
      document.querySelector("[data-answer-row]").classList.remove("show");
      return;
    }
    const entry = deck[index];
    card.classList.remove("flipped");
    card.innerHTML = `<div><div class="flashcard-word" lang="de">${reader.displayWord(entry)}</div><div class="flashcard-detail">${reader.detail(entry)}${entry.n ? `<br><small>${entry.n}</small>` : ""}</div><div class="flashcard-hint">Tap to reveal · press space</div></div>`;
    document.querySelector("[data-card-count]").textContent = `${index + 1} / ${deck.length}`;
    document.querySelector("[data-answer-row]").classList.remove("show");
  };

  const flip = () => {
    if (index >= deck.length || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    document.querySelector("[data-answer-row]").classList.add("show");
    const entry = deck[index];
    reader.speak(entry.a ? `${entry.a} ${entry.w}` : entry.w);
  };
  const answer = known => {
    const entry = deck[index];
    if (!known) missed.push(entry);
    window.WORTWEG.setKnown(entry.w, known);
    index += 1; render();
  };

  levelButtons.forEach(button => button.onclick = () => {
    const level = button.dataset.level;
    levels.has(level) ? levels.delete(level) : levels.add(level);
    button.classList.toggle("on", levels.has(level)); buildDeck();
  });
  sourceButtons.forEach(button => button.onclick = () => {
    source = button.dataset.source;
    sourceButtons.forEach(item => item.classList.toggle("on", item === button)); buildDeck();
  });
  card.onclick = flip;
  document.querySelector("[data-again]").onclick = () => answer(false);
  document.querySelector("[data-got]").onclick = () => answer(true);
  document.addEventListener("keydown", event => {
    if (event.code === "Space") { event.preventDefault(); flip(); }
    if (event.key === "Enter" && document.activeElement === card) { event.preventDefault(); flip(); }
    if (event.key === "1" && card.classList.contains("flipped")) answer(false);
    if (event.key === "2" && card.classList.contains("flipped")) answer(true);
  });
  buildDeck();
})();
