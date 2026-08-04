(() => {
  const host = document.querySelector("[data-specimen]");
  const note = document.querySelector("[data-specimen-note]");
  if (!host || !note) return;
  const reader = window.GermanReader;
  const course = window.GERMAN_COURSE;
  if (!reader) return;

  let activeButton = null;

  const renderNote = (entry, { speakIt = false, reveal = false } = {}) => {
    const article = entry.a ? `${entry.a} ` : "";
    const rows = [
      entry.a ? ["Article", entry.a, true] : null,
      entry.p ? ["Plural", entry.p, true] : null,
      [entry.t ? "Level · type" : "Level", [entry.l, entry.t].filter(Boolean).join(" · "), false]
    ].filter(Boolean);
    note.innerHTML = `
      <div class="note-head">
        <span class="note-word" lang="de">${article}${entry.w}</span>
        <span class="level-stamp">${entry.l}</span>
      </div>
      <p class="note-gloss">${entry.d}</p>
      <dl class="note-facts">
        ${rows.map(([label, value, de]) => `<div><dt>${label}</dt><dd${de ? ' lang="de"' : ""}>${value}</dd></div>`).join("")}
      </dl>
      ${entry.n ? `<p class="note-grammar">${entry.n}</p>` : ""}
      <div class="note-actions">
        <button type="button" class="icon-button" data-note-speak aria-label="Hear ${entry.w} pronounced">${reader.icon("speak")}</button>
        <button type="button" class="icon-button${window.WORTWEG.isStarred(entry.w) ? " on" : ""}" data-note-star aria-pressed="${window.WORTWEG.isStarred(entry.w) ? "true" : "false"}" aria-label="Star ${entry.w} for review">${reader.icon("star")}</button>
      </div>`;
    const spoken = entry.a ? `${entry.a} ${entry.w}` : entry.w;
    reader.registerAudioControl(note.querySelector("[data-note-speak]")).onclick = () => reader.speak(spoken);
    note.querySelector("[data-note-star]").onclick = event => {
      const on = window.WORTWEG.toggleStar(entry.w);
      event.currentTarget.classList.toggle("on", on);
      event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
    };
    if (speakIt) reader.speakIfEnabled(spoken);
    /* On a phone the plate stacks under the sheet, so the answer to a tap can land
       off-screen. Bring it into view only when it is actually out of view. */
    if (reveal) {
      const box = note.getBoundingClientRect();
      if (box.top < 0 || box.bottom > innerHeight) note.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const select = (entry, button, options) => {
    activeButton?.classList.remove("active");
    activeButton = button;
    activeButton?.classList.add("active");
    renderNote(entry, options);
  };

  const wordButton = (token, focus) => {
    if (!token.entry) return document.createTextNode(token.text);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `word${token.entry.w === focus ? " fresh" : ""}`;
    button.textContent = token.text;
    button.lang = "de";
    button.setAttribute("aria-label", `Explain ${token.text}`);
    button.onclick = event => {
      event.stopPropagation();
      select(token.entry, button, { speakIt: true, reveal: true });
      window.WORTWEG.markSeen(token.entry.w);
    };
    return button;
  };

  /* The lines ship as plain German in the markup; this replaces each one's text
     with the same words as buttons, so a script failure still leaves a readable page. */
  const lines = [...host.querySelectorAll(".specimen-line")];
  lines.forEach(line => {
    const german = line.dataset.de || line.textContent;
    const focus = line.dataset.focus || "";
    line.textContent = "";
    reader.tokenize(german).forEach(token => line.appendChild(wordButton(token, focus)));
  });

  const opener = reader.words.find(entry => entry.w === "Stadt")
    || reader.words.find(entry => entry.a && entry.p)
    || reader.words[0];
  if (opener) {
    const match = lines.flatMap(l => [...l.querySelectorAll(".word")]).find(b => b.textContent === opener.w);
    select(opener, match || null);
  }

  /* --- The three tools, each showing its own real artifact --- */

  const pick = (list, count) => {
    const out = [];
    const used = new Set();
    while (out.length < count && used.size < list.length) {
      const i = Math.floor(Math.random() * list.length);
      if (used.has(i)) continue;
      used.add(i);
      out.push(list[i]);
    }
    return out;
  };

  const segmentDemo = document.querySelector("[data-demo-segment]");
  if (segmentDemo && course?.chapters?.length) {
    const chapterIndex = 1;
    const segmentIndex = 1;
    const segment = course.chapters[chapterIndex].segments[segmentIndex];
    /* Count it rather than typing it: this demo's whole claim is that it shows
       the reader's real data, and a hardcoded sequence number was off by one. */
    const sequence = course.chapters
      .slice(0, chapterIndex)
      .reduce((total, chapter) => total + chapter.segments.length, 0) + segmentIndex + 1;
    const entry = reader.words.find(word => word.w === segment.focus);
    if (entry) {
      const article = entry.a ? `${entry.a} ` : "";
      segmentDemo.innerHTML = `
        <span class="demo-focus">
          <span class="demo-focus-count">Neues Wort<b>#${sequence}</b></span>
          <span class="demo-focus-main">
            <span class="demo-focus-word" lang="de">${article}${entry.w}</span>
            <span class="demo-focus-def">${entry.d}</span>
          </span>
          <span class="level-stamp">${entry.l}</span>
        </span>
        <span class="demo-sentence">
          <span class="demo-line" lang="de">${segment.de}</span>
          <span class="demo-translation">${segment.en}</span>
        </span>`;
    }
  }

  const boardDemo = document.querySelector("[data-demo-board]");
  if (boardDemo) {
    const pool = reader.words.filter(entry => entry.l !== "name");
    /* Real state, never invented progress: a first-time visitor sees six plain
       tiles and a legend, and a returning one sees the words they actually marked. */
    boardDemo.innerHTML = pick(pool, 6)
      .map(entry => {
        const state = window.WORTWEG.wordState(entry.w);
        return `<span class="demo-tile ${state === "new" ? "" : state}" lang="de">${entry.w}<small>${entry.l}</small></span>`;
      })
      .join("");
  }
  const boardKey = document.querySelector("[data-demo-board-key]");
  if (boardKey) {
    boardKey.innerHTML = `<span class="key-swatch key-known"></span>known<span class="key-swatch key-learning"></span>still learning`;
  }

  const cardDemo = document.querySelector("[data-demo-card]");
  if (cardDemo) {
    const nouns = reader.words.filter(entry => entry.a && entry.p);
    const entry = pick(nouns.length ? nouns : reader.words, 1)[0];
    if (entry) {
      /* Descriptive, not instructional: this face is a sample, and tapping it
         opens the deck rather than flipping the card. */
      cardDemo.innerHTML = `
        <span class="demo-card-face">
          <span class="demo-card-word" lang="de">${reader.displayWord(entry)}</span>
          <span class="demo-card-hint">${[entry.l, entry.t].filter(Boolean).join(" · ")}</span>
        </span>`;
    }
  }
})();
