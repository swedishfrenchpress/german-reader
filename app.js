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

  /* Drawn marks, one 16px grid, 1.6 stroke, square ends — the same hand as the
     rules and stamps. Nothing here is a system emoji. */
  const ICON_PATHS = {
    speak: '<path d="M2.4 6.1h2.7L8.7 3v10L5.1 9.9H2.4z" fill="currentColor" stroke="none"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5"/><path d="M13.2 3.3a6.5 6.5 0 0 1 0 9.4"/>',
    star: '<path d="M8 1.9l1.85 3.9 4.15.6-3 3 .7 4.25L8 11.63 4.3 13.65 5 9.4l-3-3 4.15-.6z"/>',
    check: '<path d="M2.6 8.3l3.7 3.7L13.4 4.9"/>',
    close: '<path d="M3.5 3.5l9 9"/><path d="M12.5 3.5l-9 9"/>',
    play: '<path d="M4.2 2.7L13 8l-8.8 5.3z" fill="currentColor" stroke="none"/>',
    book: '<path d="M2.2 3.1h4.4c.8 0 1.4.6 1.4 1.4v9c0-.8-.6-1.4-1.4-1.4H2.2z"/><path d="M13.8 3.1H9.4c-.8 0-1.4.6-1.4 1.4v9c0-.8.6-1.4 1.4-1.4h4.4z"/>',
    grid: '<path d="M2.4 2.4h4.4v4.4H2.4zM9.2 2.4h4.4v4.4H9.2zM2.4 9.2h4.4v4.4H2.4zM9.2 9.2h4.4v4.4H9.2z"/>',
    cards: '<path d="M5.2 5.2h8.4v8.4H5.2z"/><path d="M10.9 5.2V2.4H2.5v8.4h2.7"/>'
  };
  const icon = (name, extra = "") =>
    `<svg class="icon${extra ? ` ${extra}` : ""}" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">${ICON_PATHS[name] || ""}</svg>`;

  let activeUtterance = null;
  let germanVoices = [];
  let voicesQueried = false;
  const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  /* Reading localStorage throws outright in partitioned and cookie-blocked
     contexts. Unguarded, that killed this whole module — and with it the reader,
     the cards and the board — on exactly the privacy setups this product courts. */
  let storageBlocked = false;
  const readSetting = (key, fallback = null) => {
    try { return localStorage.getItem(key); }
    catch (_) { storageBlocked = true; return fallback; }
  };
  const writeSetting = (key, value) => {
    try { localStorage.setItem(key, value); }
    catch (_) { storageBlocked = true; }
  };
  let speechRate = Number.parseFloat(readSetting("wortweg-speech-rate") || ".84") || .84;
  let speechVoice = readSetting("wortweg-speech-voice") || "";
  let speakOnTap = readSetting("wortweg-speak-on-tap") !== "off";

  const loadVoices = () => {
    if (!supportsSpeech) return;
    const all = window.speechSynthesis.getVoices();
    if (all.length) voicesQueried = true;
    germanVoices = all.filter(voice => voice.lang.toLowerCase().startsWith("de"));
    document.dispatchEvent(new CustomEvent("wortweg-voices"));
  };
  loadVoices();
  if (supportsSpeech) {
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    /* Chrome populates the list lazily; give it a beat before we call it empty. */
    setTimeout(() => { if (!voicesQueried) { voicesQueried = true; loadVoices(); } }, 1200);
  }

  /* "unsupported" -> no speech API at all. "no-voice" -> the API exists but this
     device has no German voice installed, so audio would be wrong, not just silent. */
  const speechStatus = () => {
    if (!supportsSpeech) return "unsupported";
    if (!voicesQueried) return "pending";
    return germanVoices.length ? "ok" : "no-voice";
  };
  const speechMessage = () => {
    const status = speechStatus();
    if (status === "unsupported") return "This browser has no speech support, so audio is off.";
    if (status === "no-voice") return "No German voice is installed on this device, so audio is off.";
    return "";
  };

  const speak = text => {
    if (speechStatus() !== "ok") return false;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
    activeUtterance = new window.SpeechSynthesisUtterance(text);
    const utterance = activeUtterance;
    utterance.lang = "de-DE";
    utterance.rate = speechRate;
    utterance.volume = 1;
    const voice = germanVoices.find(item => item.name === speechVoice) || germanVoices[0];
    if (voice) utterance.voice = voice;
    utterance.onend = utterance.onerror = () => { if (activeUtterance === utterance) activeUtterance = null; };
    synth.resume();
    synth.speak(utterance);
    return true;
  };
  /* Used where audio is a side effect of another action rather than the action itself. */
  const speakIfEnabled = text => speakOnTap ? speak(text) : false;

  /* Every audio control on every page registers here, so one unavailable voice
     disables all of them with the same explanation instead of failing silently. */
  const audioControls = new Set();
  const syncAudioControls = () => {
    const status = speechStatus();
    const blocked = status === "unsupported" || status === "no-voice";
    const reason = speechMessage();
    audioControls.forEach(control => {
      if (!control.isConnected) { audioControls.delete(control); return; }
      /* Only ever undo our own disabling: several of these controls (the board's
         Reveal, for one) have disabled states that belong to their own screen. */
      if (blocked) {
        if (!control.disabled) { control.disabled = true; control.dataset.audioBlocked = "1"; }
        control.setAttribute("title", reason);
      } else if (control.dataset.audioBlocked) {
        delete control.dataset.audioBlocked;
        control.disabled = false;
        control.removeAttribute("title");
      }
    });
    document.querySelectorAll("[data-speech-notice]").forEach(node => {
      node.textContent = reason;
      node.hidden = !blocked;
    });
  };
  const registerAudioControl = control => {
    if (!control) return control;
    audioControls.add(control);
    syncAudioControls();
    return control;
  };
  document.addEventListener("wortweg-voices", syncAudioControls);

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
    popover.tabIndex = -1;
    popover.setAttribute("aria-live", "polite");
    popover.setAttribute("aria-label", "Word explanation");
    document.body.appendChild(popover);
    return popover;
  };

  const isOpen = () => Boolean(popover?.classList.contains("show"));

  const closePopover = ({ restoreFocus = false } = {}) => {
    if (!popover) return;
    const returnTo = activeButton;
    popover.classList.remove("show");
    activeButton?.classList.remove("active");
    activeButton?.setAttribute("aria-expanded", "false");
    activeButton = null;
    if (restoreFocus && returnTo?.isConnected) returnTo.focus();
  };

  const showWord = (entry, button, { viaKeyboard = false } = {}) => {
    activeButton?.classList.remove("active");
    activeButton?.setAttribute("aria-expanded", "false");
    activeButton = button || null;
    activeButton?.classList.add("active");
    activeButton?.setAttribute("aria-expanded", "true");
    activeButton?.setAttribute("aria-controls", "word-popover");
    const root = ensurePopover();
    const isStarred = window.WORTWEG?.isStarred(entry.w);
    const isKnown = window.WORTWEG?.isKnown(entry.w);
    const spokenText = entry.a ? `${entry.a} ${entry.w}` : entry.w;
    /* Mapping the form on the page to its dictionary word is the hardest part of
       early German, so say it out loud instead of silently showing the lemma. */
    const tapped = (button?.textContent || "").trim();
    const inflected = tapped && normalize(tapped) !== normalize(entry.w);
    root.innerHTML = `
      <div class="pop-main">
        ${inflected ? `<div class="pop-form" lang="de">${tapped} <span aria-label="is a form of">→</span></div>` : ""}
        <div class="pop-word" lang="de">${displayWord(entry)}</div>
        <div class="pop-meta">${detail(entry)}</div>
      </div>
      <div class="pop-actions">
        <button type="button" class="icon-button pop-button" data-action="speak" aria-label="Hear ${entry.w} pronounced">${icon("speak")}</button>
        <button type="button" class="icon-button pop-button${isStarred ? " on" : ""}" data-action="star" aria-pressed="${isStarred ? "true" : "false"}" aria-label="Star ${entry.w} for review">${icon("star")}</button>
        <button type="button" class="icon-button pop-button${isKnown ? " on" : ""}" data-action="known" aria-pressed="${isKnown ? "true" : "false"}" aria-label="Mark ${entry.w} as known">${icon("check")}</button>
        <button type="button" class="icon-button pop-button pop-close" data-action="close" aria-label="Close word explanation">${icon("close")}</button>
      </div>
      ${entry.n ? `<div class="pop-note">${entry.n}</div>` : ""}`;
    registerAudioControl(root.querySelector('[data-action="speak"]')).onclick = () => speak(spokenText);
    root.querySelector('[data-action="star"]').onclick = event => {
      const on = window.WORTWEG.toggleStar(entry.w);
      event.currentTarget.classList.toggle("on", on);
      event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
    };
    root.querySelector('[data-action="known"]').onclick = event => {
      const on = window.WORTWEG.toggleKnown(entry.w);
      event.currentTarget.classList.toggle("on", on);
      event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
    };
    root.querySelector('[data-action="close"]').onclick = () => closePopover({ restoreFocus: true });
    window.WORTWEG?.markSeen(entry.w);
    root.classList.add("show");
    if (viaKeyboard) root.focus();
    speakIfEnabled(spokenText);
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen()) {
      event.stopPropagation();
      closePopover({ restoreFocus: true });
    }
  });
  /* The reason a tap outside dismisses: the word buttons stop propagation, so
     anything reaching the document is genuinely elsewhere on the page. */
  document.addEventListener("pointerdown", event => {
    if (!isOpen()) return;
    if (popover.contains(event.target)) return;
    if (event.target.closest?.(".word")) return;
    closePopover();
  });
  document.addEventListener("focusin", event => {
    if (!isOpen()) return;
    if (popover.contains(event.target) || event.target === activeButton) return;
    closePopover();
  });

  const voices = () => [...germanVoices];
  const getSpeechSettings = () => ({ voice: speechVoice, rate: speechRate, speakOnTap });
  const setSpeechVoice = name => {
    speechVoice = name || "";
    writeSetting("wortweg-speech-voice", speechVoice);
  };
  const setSpeechRate = rate => {
    speechRate = Math.min(1.2, Math.max(.6, Number(rate) || .84));
    writeSetting("wortweg-speech-rate", String(speechRate));
  };
  const setSpeakOnTap = value => {
    speakOnTap = Boolean(value);
    writeSetting("wortweg-speak-on-tap", speakOnTap ? "on" : "off");
    document.dispatchEvent(new CustomEvent("wortweg-speak-on-tap"));
    return speakOnTap;
  };

  /* Wires the shared sound switch that every interactive page carries, so the
     setting is reachable from wherever the sound actually happens. */
  const mountSoundToggle = () => {
    document.querySelectorAll("[data-speak-toggle]").forEach(button => {
      const paint = () => {
        button.classList.toggle("on", speakOnTap);
        button.setAttribute("aria-pressed", speakOnTap ? "true" : "false");
        const label = button.querySelector("[data-speak-toggle-label]");
        if (label) label.textContent = speakOnTap ? "Auto-speak on" : "Auto-speak off";
      };
      button.onclick = () => { setSpeakOnTap(!speakOnTap); paint(); };
      document.addEventListener("wortweg-speak-on-tap", paint);
      registerAudioControl(button);
      paint();
    });
    syncAudioControls();
  };
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", mountSoundToggle)
    : mountSoundToggle();

  window.GermanReader = {
    words, lookup, normalize, displayWord, detail, icon,
    speak, speakIfEnabled, speechStatus, speechMessage, registerAudioControl, syncAudioControls,
    storageBlocked: () => storageBlocked,
    tokenize, showWord, closePopover, voices,
    getSpeechSettings, setSpeechVoice, setSpeechRate, setSpeakOnTap
  };
})();
