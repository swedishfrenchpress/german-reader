/* Shared, dependency-free progress store for Wort für Wort. */
window.WORTWEG = (() => {
  const KEYS = {
    starred: "wortweg-starred-v1",
    known: "wortweg-known-v1",
    seen: "wortweg-seen-v1"
  };
  const read = key => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch (_) { return new Set(); }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify([...value])); }
    catch (_) {}
  };
  let starred = read(KEYS.starred);
  let known = read(KEYS.known);
  let seen = read(KEYS.seen);
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn());
  const toggle = (set, key, word) => {
    set.has(word) ? set.delete(word) : set.add(word);
    write(key, set); notify(); return set.has(word);
  };

  window.addEventListener("storage", event => {
    if (event.key === KEYS.starred) starred = read(KEYS.starred);
    if (event.key === KEYS.known) known = read(KEYS.known);
    if (event.key === KEYS.seen) seen = read(KEYS.seen);
    notify();
  });

  return {
    isStarred: word => starred.has(word),
    isKnown: word => known.has(word),
    isSeen: word => seen.has(word),
    starred: () => [...starred],
    known: () => [...known],
    seen: () => [...seen],
    toggleStar: word => toggle(starred, KEYS.starred, word),
    toggleKnown: word => toggle(known, KEYS.known, word),
    setKnown(word, value) {
      value ? known.add(word) : known.delete(word);
      write(KEYS.known, known); notify();
    },
    markSeen(word) {
      if (!seen.has(word)) { seen.add(word); write(KEYS.seen, seen); notify(); }
    },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    exportData() {
      let course = null;
      try { course = JSON.parse(localStorage.getItem("wortweg-course-progress-v1") || "null"); }
      catch (_) {}
      return { version: 1, app: "wortweg", exported: new Date().toISOString(), starred: [...starred], known: [...known], seen: [...seen], progress: { course } };
    },
    importData(data) {
      if (!data || data.app !== "wortweg") throw new Error("This is not a Wort für Wort backup.");
      (data.starred || []).forEach(word => starred.add(word));
      (data.known || []).forEach(word => known.add(word));
      (data.seen || []).forEach(word => seen.add(word));
      write(KEYS.starred, starred); write(KEYS.known, known); write(KEYS.seen, seen); notify();
      if (data.progress?.course) localStorage.setItem("wortweg-course-progress-v1", JSON.stringify(data.progress.course));
    },
    clear() {
      starred = new Set(); known = new Set(); seen = new Set();
      [...Object.values(KEYS), "wortweg-course-progress-v1", "wortweg-custom-set"].forEach(key => localStorage.removeItem(key)); notify();
    }
  };
})();
