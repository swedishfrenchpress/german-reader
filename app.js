(() => {
  const words = window.GERMAN_WORDS || [];
  const normalize = value => value.toLocaleLowerCase("de-DE").replace(/[“”„'’]/g, "");
  const lookup = new Map();

  words.forEach(entry => {
    [entry.w, ...(entry.f || [])].forEach(form => lookup.set(normalize(form), entry));
  });

  const displayWord = entry => entry.a ? `${entry.a} ${entry.w}` : entry.w;
  const detail = entry => {
    const parts = [entry.d, entry.l, entry.t];
    if (entry.p) parts.push(`plural: ${entry.p}`);
    return parts.filter(Boolean).join(" · ");
  };

  const speak = text => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = .84;
    const voice = speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith("de"));
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  const tokenize = text => {
    const chunks = text.match(/[\p{L}ÄÖÜäöüß]+(?:-[\p{L}ÄÖÜäöüß]+)*|\s+|[^\s\p{L}ÄÖÜäöüß]+/gu) || [text];
    return chunks.map(chunk => ({ text: chunk, entry: lookup.get(normalize(chunk)) || null }));
  };

  let popover;
  let activeButton;
  const ensurePopover = () => {
    if (popover) return popover;
    popover = document.createElement("aside");
    popover.className = "word-popover";
    popover.id = "word-popover";
    popover.setAttribute("aria-live", "polite");
    document.body.appendChild(popover);
    return popover;
  };

  const closePopover = () => {
    ensurePopover().classList.remove("show");
    activeButton?.classList.remove("active");
    activeButton = null;
  };

  const showWord = (entry, button) => {
    activeButton?.classList.remove("active");
    activeButton = button || null;
    activeButton?.classList.add("active");
    const root = ensurePopover();
    const isStarred = window.WORTWEG?.isStarred(entry.w);
    const isKnown = window.WORTWEG?.isKnown(entry.w);
    root.innerHTML = `
      <div>
        <div class="pop-word">${displayWord(entry)}</div>
        <div class="pop-meta">${detail(entry)}</div>
      </div>
      <div class="pop-actions">
        <button type="button" data-action="speak" aria-label="Pronounce ${entry.w}">▶</button>
        <button type="button" data-action="star" class="${isStarred ? "on" : ""}" aria-label="Star ${entry.w}">★</button>
        <button type="button" data-action="known" class="${isKnown ? "on" : ""}" aria-label="Mark ${entry.w} known">✓</button>
      </div>
      ${entry.n ? `<div class="pop-note">${entry.n}</div>` : ""}`;
    root.querySelector('[data-action="speak"]').onclick = () => speak(entry.a ? `${entry.a} ${entry.w}` : entry.w);
    root.querySelector('[data-action="star"]').onclick = event => event.currentTarget.classList.toggle("on", window.WORTWEG.toggleStar(entry.w));
    root.querySelector('[data-action="known"]').onclick = event => event.currentTarget.classList.toggle("on", window.WORTWEG.toggleKnown(entry.w));
    window.WORTWEG?.markSeen(entry.w);
    root.classList.add("show");
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePopover();
  });

  window.GermanReader = { words, lookup, normalize, displayWord, detail, speak, tokenize, showWord, closePopover };
})();
