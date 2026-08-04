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
    sourceButtons.forEach(button => {
      button.classList.toggle("on", button === customButton);
      button.setAttribute("aria-pressed", button === customButton ? "true" : "false");
    });
  }
  /* Arriving from the board or the drawer with a review set: open on that deck
     rather than making the learner hunt for the filter that produced it. */
  const requestedSource = new URLSearchParams(location.search).get("source");
  if (!customWords.size && requestedSource) {
    const target = sourceButtons.find(button => button.dataset.source === requestedSource);
    if (target) {
      source = requestedSource;
      sourceButtons.forEach(button => {
        button.classList.toggle("on", button === target);
        button.setAttribute("aria-pressed", button === target ? "true" : "false");
      });
    }
  }
  /* A sitting, not a dictionary. 244 cards reshuffled every visit meant a learner
     never met the same twenty twice; a fixed sitting is a decision they can finish. */
  const SESSION_SIZE = 24;
  let deck = [];
  let pool = [];
  let index = 0;
  let total = 0;
  let repeats = new Set();

  /* Fisher–Yates. The old `sort(() => Math.random() - .5)` is not a shuffle:
     it leaves the front of the deck correlated with the source order. */
  const shuffle = items => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  const buildDeck = () => {
    let next = reader.words.filter(entry => levels.has(entry.l));
    if (source === "custom") next = next.filter(entry => customWords.has(entry.w));
    if (source === "starred") next = next.filter(entry => window.WORTWEG.isStarred(entry.w));
    if (source === "seen") next = next.filter(entry => window.WORTWEG.isSeen(entry.w));
    if (source === "learning") next = next.filter(entry => window.WORTWEG.isLearning(entry.w));
    pool = next;
    deck = shuffle(next).slice(0, SESSION_SIZE);
    total = deck.length;
    index = 0; repeats = new Set();
    render();
  };

  const emptyMessage = () => {
    if (!levels.size) return "No levels selected. Turn at least one of A1, A2 or B1 back on.";
    if (source === "starred") return "You have not starred any words yet. Star a word while reading, or from the board.";
    if (source === "seen") return "You have not reached any words in the course yet.";
    if (source === "learning") return "Nothing is marked still learning. Words you miss on the board or on a card land here.";
    if (source === "custom") return "That review set is empty. Collect a few more words in the course first.";
    return "No words match this deck yet.";
  };

  const render = () => {
    const empty = document.querySelector("[data-empty]");
    const stage = document.querySelector("[data-card-stage]");
    const emptyCopy = document.querySelector("[data-empty-copy]");
    if (!deck.length) {
      if (emptyCopy) emptyCopy.textContent = emptyMessage();
      empty.hidden = false; stage.hidden = true; return;
    }
    empty.hidden = true; stage.hidden = false;
    if (index >= deck.length) {
      document.querySelector("[data-card-count]").textContent = `${total} / ${total}`;
      const repeated = repeats.size;
      const more = pool.length > SESSION_SIZE;
      card.innerHTML = `<div><div class="flashcard-word" lang="de">Geschafft.</div><div class="flashcard-detail" style="display:block">You finished ${total} card${total === 1 ? "" : "s"}. ${repeated ? `${repeated} came back for another look and ${repeated === 1 ? "is" : "are"} saved as still learning.` : "Every card was known first time."}</div><button class="button primary" type="button" data-next-round>${more ? `Deal another ${Math.min(SESSION_SIZE, pool.length)}` : "Shuffle and go again"}</button><div class="flashcard-hint">${more ? `${pool.length} words in this filter` : "Or change a filter above"}</div></div>`;
      card.classList.add("flipped");
      card.querySelector("[data-next-round]").onclick = event => { event.stopPropagation(); buildDeck(); };
      document.querySelector("[data-answer-row]").classList.remove("show");
      return;
    }
    const entry = deck[index];
    card.classList.remove("flipped");
    const hint = matchMedia("(pointer: coarse)").matches ? "Tap to reveal" : "Click to reveal · or press space";
    card.innerHTML = `<div><div class="flashcard-word" lang="de">${reader.displayWord(entry)}</div><div class="flashcard-detail">${reader.detail(entry)}${entry.n ? `<br><small>${entry.n}</small>` : ""}</div><div class="flashcard-hint" data-hint>${hint}</div></div>`;
    card.setAttribute("aria-label", `Reveal the meaning of ${reader.displayWord(entry)}`);
    /* The denominator used to grow every time you missed a card, so the finish
       line walked away from you. Repeats are counted separately instead. */
    const repeating = repeats.size ? ` · ${repeats.size} repeating` : "";
    document.querySelector("[data-card-count]").textContent = `${index + 1} / ${total}${repeating}`;
    document.querySelector("[data-answer-row]").classList.remove("show");
  };

  const flip = () => {
    if (index >= deck.length || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    document.querySelector("[data-answer-row]").classList.add("show");
    const entry = deck[index];
    /* Announce the answer: a screen-reader user pressing space heard nothing,
       and the card still claimed it needed revealing. */
    const detail = card.querySelector(".flashcard-detail");
    const hint = card.querySelector("[data-hint]");
    if (hint) hint.textContent = "Did you know it?";
    card.setAttribute("aria-label", `${reader.displayWord(entry)} — ${reader.detail(entry)}`);
    if (detail) detail.setAttribute("role", "status");
    reader.speakIfEnabled(entry.a ? `${entry.a} ${entry.w}` : entry.w);
  };

  /* "Again" now means again: the card is spliced back into the deck a few
     positions ahead instead of vanishing with a counter bump. */
  const answer = known => {
    const entry = deck[index];
    if (!entry) return;
    window.WORTWEG.setState(entry.w, known ? "known" : "learning");
    if (known) repeats.delete(entry.w);
    else {
      repeats.add(entry.w);
      deck.splice(Math.min(index + 5, deck.length), 0, entry);
    }
    index += 1;
    render();
  };

  /* The settings collapse to one line so the card, not the filter form, is what
     you see first; the summary keeps the current deck legible while closed. */
  const summary = document.querySelector("[data-deck-summary]");
  const paintSummary = () => {
    if (!summary) return;
    const levelText = ["A1", "A2", "B1"].filter(level => levels.has(level)).join(" ") || "no levels";
    const sourceButton = sourceButtons.find(button => button.classList.contains("on"));
    summary.textContent = `${levelText} · ${sourceButton ? sourceButton.textContent.trim() : "All words"}`;
  };
  paintSummary();

  levelButtons.forEach(button => button.onclick = () => {
    const level = button.dataset.level;
    levels.has(level) ? levels.delete(level) : levels.add(level);
    button.classList.toggle("on", levels.has(level));
    button.setAttribute("aria-pressed", levels.has(level) ? "true" : "false");
    paintSummary(); buildDeck();
  });
  sourceButtons.forEach(button => button.onclick = () => {
    source = button.dataset.source;
    sourceButtons.forEach(item => {
      item.classList.toggle("on", item === button);
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
    paintSummary(); buildDeck();
  });
  card.onclick = flip;
  document.querySelector("[data-again]").onclick = () => answer(false);
  document.querySelector("[data-got]").onclick = () => answer(true);
  document.addEventListener("keydown", event => {
    if (event.target.matches("input, select, textarea")) return;
    if (event.code === "Space") { event.preventDefault(); flip(); }
    if (event.key === "Enter" && document.activeElement === card) { event.preventDefault(); flip(); }
    if (event.key === "1" && card.classList.contains("flipped")) answer(false);
    if (event.key === "2" && card.classList.contains("flipped")) answer(true);
  });
  buildDeck();
})();
