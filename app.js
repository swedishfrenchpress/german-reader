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

  let activeUtterance = null;
  let germanVoices = [];
  let speechRate = Number.parseFloat(localStorage.getItem("wortweg-speech-rate") || ".84") || .84;
  let speechVoice = localStorage.getItem("wortweg-speech-voice") || "";
  const loadVoices = () => {
    if (!("speechSynthesis" in window)) return;
    germanVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang.toLowerCase().startsWith("de"));
    document.dispatchEvent(new CustomEvent("wortweg-voices"));
  };
  loadVoices();
  if ("speechSynthesis" in window) window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);

  const speak = text => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return false;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
    activeUtterance = new window.SpeechSynthesisUtterance(text);
    const utterance = activeUtterance;
    utterance.lang = "de-DE";
    utterance.rate = speechRate;
    utterance.volume = 1;
    const voice = germanVoices.find(item => item.name === speechVoice) || germanVoices[0] || synth.getVoices().find(item => item.lang.toLowerCase().startsWith("de"));
    if (voice) utterance.voice = voice;
    utterance.onend = utterance.onerror = () => { if (activeUtterance === utterance) activeUtterance = null; };
    synth.resume();
    synth.speak(utterance);
    return true;
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
    const spokenText = entry.a ? `${entry.a} ${entry.w}` : entry.w;
    root.innerHTML = `
      <div>
        <div class="pop-word">${displayWord(entry)}</div>
        <div class="pop-meta">${detail(entry)}</div>
      </div>
      <div class="pop-actions">
        <button type="button" data-action="speak" aria-label="Pronounce ${entry.w}" title="Hear pronunciation">🔊</button>
        <button type="button" data-action="star" class="${isStarred ? "on" : ""}" aria-label="Star ${entry.w}">★</button>
        <button type="button" data-action="known" class="${isKnown ? "on" : ""}" aria-label="Mark ${entry.w} known">✓</button>
      </div>
      ${entry.n ? `<div class="pop-note">${entry.n}</div>` : ""}`;
    root.querySelector('[data-action="speak"]').onclick = () => speak(spokenText);
    root.querySelector('[data-action="star"]').onclick = event => event.currentTarget.classList.toggle("on", window.WORTWEG.toggleStar(entry.w));
    root.querySelector('[data-action="known"]').onclick = event => event.currentTarget.classList.toggle("on", window.WORTWEG.toggleKnown(entry.w));
    window.WORTWEG?.markSeen(entry.w);
    root.classList.add("show");
    speak(spokenText);
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePopover();
  });

  const voices = () => [...germanVoices];
  const getSpeechSettings = () => ({ voice: speechVoice, rate: speechRate });
  const setSpeechVoice = name => {
    speechVoice = name || "";
    try { localStorage.setItem("wortweg-speech-voice", speechVoice); }
    catch (_) {}
  };
  const setSpeechRate = rate => {
    speechRate = Math.min(1.2, Math.max(.6, Number(rate) || .84));
    try { localStorage.setItem("wortweg-speech-rate", String(speechRate)); }
    catch (_) {}
  };

  window.GermanReader = { words, lookup, normalize, displayWord, detail, speak, tokenize, showWord, closePopover, voices, getSpeechSettings, setSpeechVoice, setSpeechRate };
})();
