/* Shared, dependency-free progress store for Wort für Wort. */
window.WORTWEG = (() => {
  const KEYS = {
    starred: "wortweg-starred-v1",
    known: "wortweg-known-v1",
    learning: "wortweg-learning-v1",
    seen: "wortweg-seen-v1"
  };

  /* One honest flag: every write reports whether the browser actually kept it,
     so the interface can stop promising that progress saves. */
  let storageOk = true;
  const read = key => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch (_) { storageOk = false; return new Set(); }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify([...value])); }
    catch (_) { storageOk = false; notify(); }
  };

  let starred = read(KEYS.starred);
  let known = read(KEYS.known);
  let learning = read(KEYS.learning);
  let seen = read(KEYS.seen);
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn());
  const toggle = (set, key, word) => {
    set.has(word) ? set.delete(word) : set.add(word);
    write(key, set); notify(); return set.has(word);
  };

  /* A word holds exactly one state. Marking it one thing clears the other,
     so "known", "learning" and "new" can never disagree across screens. */
  const setState = (word, state) => {
    known.delete(word);
    learning.delete(word);
    if (state === "known") known.add(word);
    if (state === "learning") learning.add(word);
    write(KEYS.known, known);
    write(KEYS.learning, learning);
    notify();
    return state;
  };

  window.addEventListener("storage", event => {
    if (event.key === KEYS.starred) starred = read(KEYS.starred);
    if (event.key === KEYS.known) known = read(KEYS.known);
    if (event.key === KEYS.learning) learning = read(KEYS.learning);
    if (event.key === KEYS.seen) seen = read(KEYS.seen);
    notify();
  });

  return {
    isStarred: word => starred.has(word),
    isKnown: word => known.has(word),
    isLearning: word => learning.has(word),
    isSeen: word => seen.has(word),
    wordState: word => known.has(word) ? "known" : learning.has(word) ? "learning" : "new",
    starred: () => [...starred],
    known: () => [...known],
    learning: () => [...learning],
    seen: () => [...seen],
    storageAvailable: () => storageOk,
    toggleStar: word => toggle(starred, KEYS.starred, word),
    toggleKnown: word => setState(word, known.has(word) ? null : "known") === "known",
    setState,
    setKnown(word, value) { setState(word, value ? "known" : "learning"); },
    markSeen(word) {
      if (!seen.has(word)) { seen.add(word); write(KEYS.seen, seen); notify(); }
    },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    exportData() {
      let course = null;
      try { course = JSON.parse(localStorage.getItem("wortweg-course-progress-v1") || "null"); }
      catch (_) {}
      return { version: 1, app: "wortweg", exported: new Date().toISOString(), starred: [...starred], known: [...known], learning: [...learning], seen: [...seen], progress: { course } };
    },
    importData(data) {
      if (!data || data.app !== "wortweg") throw new Error("This is not a Wort für Wort backup.");
      (data.starred || []).forEach(word => starred.add(word));
      (data.known || []).forEach(word => known.add(word));
      (data.learning || []).forEach(word => learning.add(word));
      (data.seen || []).forEach(word => seen.add(word));
      write(KEYS.starred, starred); write(KEYS.known, known); write(KEYS.learning, learning); write(KEYS.seen, seen); notify();
      if (data.progress?.course) localStorage.setItem("wortweg-course-progress-v1", JSON.stringify(data.progress.course));
    },
    clear() {
      starred = new Set(); known = new Set(); learning = new Set(); seen = new Set();
      [...Object.values(KEYS), "wortweg-course-progress-v1", "wortweg-custom-set"].forEach(key => localStorage.removeItem(key)); notify();
    }
  };
})();
