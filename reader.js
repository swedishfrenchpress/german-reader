(() => {
  const root = document.querySelector("[data-reader]");
  if (!root) return;
  const reader = window.GermanReader;
  const courseMode = root.dataset.reader === "course";
  const story = courseMode ? window.GERMAN_COURSE : window.GERMAN_STORIES[root.dataset.reader];
  if (!story) return;

  document.title = `${story.title} · Wort für Wort`;
  const storyTitle = document.querySelector("[data-story-title]");
  storyTitle.textContent = story.title;
  storyTitle.lang = "de";
  const levelNode = document.querySelector("[data-story-level]");
  if (levelNode) levelNode.textContent = story.level;
  document.querySelector("[data-story-intro]").textContent = story.intro;

  /* The two dismiss controls ship as bare "×" in the markup so the page still
     reads without script; swap them for the drawn mark once we are running. */
  document.querySelectorAll("[data-vocab-close], [data-resume-dismiss]").forEach(button => {
    button.innerHTML = reader.icon("close");
  });

  const storageNotice = document.querySelector("[data-storage-notice]");
  const syncStorageNotice = () => {
    if (storageNotice) storageNotice.hidden = window.WORTWEG.storageAvailable() && !reader.storageBlocked();
  };
  syncStorageNotice();

  const wordButton = (token, focus = "") => {
    if (!token.entry) return document.createTextNode(token.text);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `word${token.entry.w === focus ? " fresh" : ""}`;
    button.textContent = token.text;
    button.lang = "de";
    button.setAttribute("aria-label", `Explain ${token.text}`);
    button.setAttribute("aria-expanded", "false");
    button.onclick = event => {
      event.stopPropagation();
      reader.showWord(token.entry, button, { viaKeyboard: event.detail === 0 });
    };
    return button;
  };

  const tokenizedLine = (text, focus = "") => {
    const fragment = document.createDocumentFragment();
    reader.tokenize(text).forEach(token => fragment.appendChild(wordButton(token, focus)));
    return fragment;
  };

  const renderStandardStory = () => {
    const makeParagraph = paragraph => {
      const wrapper = document.createElement("div");
      const line = document.createElement("p");
      line.className = "story-paragraph";
      line.lang = "de";
      const actions = document.createElement("span");
      actions.className = "line-actions";
      actions.innerHTML = `<button class="icon-button inline" type="button" aria-label="Read this sentence aloud">${reader.icon("play")}</button><button class="icon-button inline" type="button" aria-label="Show translation">EN</button>`;
      reader.registerAudioControl(actions.firstElementChild).onclick = () => reader.speak(paragraph.de);
      line.appendChild(actions);
      line.appendChild(tokenizedLine(paragraph.de));
      const translation = document.createElement("div");
      translation.className = "story-translation";
      translation.textContent = paragraph.en;
      actions.lastElementChild.onclick = event => {
        const shown = translation.classList.toggle("show");
        event.currentTarget.setAttribute("aria-label", shown ? "Hide translation" : "Show translation");
      };
      wrapper.append(line, translation);
      return wrapper;
    };

    story.chapters.forEach((chapter, index) => {
      const section = document.createElement("section");
      section.className = "chapter";
      section.innerHTML = `<h2 lang="de"><span class="chapter-number">Kapitel ${String(index + 1).padStart(2, "0")}</span>${chapter.title}</h2>`;
      chapter.paragraphs.forEach(paragraph => section.appendChild(makeParagraph(paragraph)));
      root.appendChild(section);
    });
  };

  const renderCourse = () => {
    const allSegments = [];
    const toc = document.querySelector("[data-toc-list]");
    let sequence = 0;

    story.chapters.forEach((chapter, chapterIndex) => {
      const section = document.createElement("section");
      section.className = "course-chapter";
      section.id = `kapitel-${chapterIndex + 1}`;
      section.innerHTML = `<header class="course-chapter-head"><h2 lang="de"><span class="chapter-number">Kapitel ${String(chapterIndex + 1).padStart(2, "0")}</span>${chapter.title}</h2><p>${chapter.en}</p></header>`;

      const tocLink = document.createElement("a");
      tocLink.href = `#${section.id}`;
      tocLink.dataset.chapter = chapterIndex;
      tocLink.innerHTML = `<span class="toc-number">${String(chapterIndex + 1).padStart(2, "0")}</span><span lang="de">${chapter.title}</span><span class="toc-check"></span>`;
      tocLink.onclick = () => document.querySelector("[data-course-toc]")?.removeAttribute("open");
      toc.appendChild(tocLink);

      chapter.segments.forEach(segment => {
        sequence += 1;
        const entry = reader.words.find(word => word.w === segment.focus);
        if (!entry) return;
        const article = entry.a ? `${entry.a} ` : "";
        const extra = entry.p ? `Plural: ${entry.p}` : (entry.n || "");
        const learning = document.createElement("article");
        learning.className = "learning-segment";
        learning.dataset.index = sequence - 1;
        learning.dataset.focus = entry.w;
        learning.id = `wort-${sequence}`;
        learning.innerHTML = `
          <div class="focus-card">
            <div class="focus-count">Neues Wort<b>#${sequence}</b></div>
            <div class="focus-main">
              <div class="focus-word-row"><span class="focus-word" lang="de">${article}${entry.w}</span><span class="level-stamp">${entry.l}</span></div>
              <div class="focus-def">${entry.d}</div>
              ${extra ? `<div class="focus-extra">${extra}</div>` : ""}
            </div>
            <div class="focus-tools">
              <button type="button" class="icon-button" data-focus-speak aria-label="Hear ${entry.w} pronounced">${reader.icon("speak")}</button>
              <button type="button" class="icon-button course-star${window.WORTWEG.isStarred(entry.w) ? " on" : ""}" data-focus-star aria-pressed="${window.WORTWEG.isStarred(entry.w) ? "true" : "false"}" aria-label="Star ${entry.w} for review">${reader.icon("star")}</button>
            </div>
          </div>
          <p class="course-line" lang="de"></p>
          <div class="course-line-actions">
            <button type="button" data-line-speak>${reader.icon("play")} Hear sentence</button>
            <button type="button" data-line-translate>EN Translation</button>
            <span class="story-translation">${segment.en}</span>
          </div>`;
        learning.querySelector(".course-line").appendChild(tokenizedLine(segment.de, entry.w));
        const spoken = entry.a ? `${entry.a} ${entry.w}` : entry.w;
        reader.registerAudioControl(learning.querySelector("[data-focus-speak]")).onclick = () => reader.speak(spoken);
        learning.querySelector("[data-focus-star]").onclick = event => {
          const on = window.WORTWEG.toggleStar(entry.w);
          event.currentTarget.classList.toggle("on", on);
          event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
        };
        reader.registerAudioControl(learning.querySelector("[data-line-speak]")).onclick = () => reader.speak(segment.de);
        learning.querySelector("[data-line-translate]").onclick = event => {
          const translation = learning.querySelector(".story-translation");
          translation.classList.toggle("show");
          event.currentTarget.textContent = translation.classList.contains("show") ? "Hide translation" : "EN Translation";
        };
        section.appendChild(learning);
        allSegments.push({ element: learning, entry, chapterIndex, text: segment.de });
      });
      /* A 30-chapter course offers 30 moments of closure; it used to spend all of
         them on one ending 34,000px down. Each chapter now closes on its own. */
      if (chapterIndex < story.chapters.length - 1) {
        const rest = document.createElement("div");
        rest.className = "chapter-rest";
        rest.dataset.chapterEnd = chapterIndex;
        rest.innerHTML = `<span class="chapter-rest-mark" aria-hidden="true"></span><span class="chapter-rest-copy">Ende Kapitel ${String(chapterIndex + 1).padStart(2, "0")}<b hidden data-chapter-words></b></span><a class="chapter-rest-next" href="#kapitel-${chapterIndex + 2}">Kapitel ${String(chapterIndex + 2).padStart(2, "0")} <span lang="de">${story.chapters[chapterIndex + 1].title}</span></a>`;
        section.appendChild(rest);
      }
      root.appendChild(section);
    });

    document.querySelectorAll("[data-segment-count]").forEach(node => { node.textContent = allSegments.length; });

    const finish = document.createElement("section");
    finish.className = "course-finish";
    finish.innerHTML = `<b lang="de">Geschafft.</b><p>You reached all ${allSegments.length} featured words across ${story.chapters.length} chapters. Keep the ones that still feel new in your starred deck.</p>`;
    root.appendChild(finish);

    const progressKey = "wortweg-course-progress-v1";
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(progressKey) || "null"); }
      catch (_) { return null; }
    })();
    let maxIndex = Number.isInteger(saved?.maxIndex) ? Math.min(saved.maxIndex, allSegments.length - 1) : -1;
    let starOnly = false;

    const save = () => {
      try { localStorage.setItem(progressKey, JSON.stringify({ maxIndex, total: allSegments.length, updated: new Date().toISOString() })); }
      catch (_) { if (storageNotice) storageNotice.hidden = false; }
    };
    const unlockedEntries = () => {
      const unique = new Map();
      allSegments.slice(0, maxIndex + 1).forEach(item => unique.set(item.entry.w, item.entry));
      return [...unique.values()];
    };
    const updateToc = () => {
      let completed = 0;
      [...toc.querySelectorAll("a")].forEach((link, chapterIndex) => {
        const lastIndex = allSegments.reduce((last, item, index) => item.chapterIndex === chapterIndex ? index : last, -1);
        const firstIndex = allSegments.findIndex(item => item.chapterIndex === chapterIndex);
        const done = lastIndex >= 0 && maxIndex >= lastIndex;
        const current = firstIndex <= maxIndex + 1 && maxIndex < lastIndex;
        link.classList.toggle("done", done);
        link.classList.toggle("current", current);
        const check = link.querySelector(".toc-check");
        check.innerHTML = done ? reader.icon("check") : "";
        check.setAttribute("aria-label", done ? "Chapter finished" : current ? "Current chapter" : "");
        if (done) completed += 1;
      });
      document.querySelector("[data-toc-progress]").textContent = `${completed} / ${story.chapters.length}`;
    };
    const updateStats = () => {
      document.querySelector("[data-unlocked-count]").textContent = Math.max(0, maxIndex + 1);
      document.querySelector("[data-vocab-count]").textContent = unlockedEntries().length;
      document.querySelector("[data-star-count]").textContent = window.WORTWEG.starred().length;
      document.querySelectorAll("[data-focus-star]").forEach((button, index) => {
        const on = window.WORTWEG.isStarred(allSegments[index].entry.w);
        button.classList.toggle("on", on);
        button.setAttribute("aria-pressed", on ? "true" : "false");
      });
      updateToc();
      syncStorageNotice();
      document.querySelectorAll("[data-chapter-end]").forEach(rest => {
        const chapterIndex = Number(rest.dataset.chapterEnd);
        const last = allSegments.reduce((acc, item, index) => item.chapterIndex === chapterIndex ? index : acc, -1);
        const done = last >= 0 && maxIndex >= last;
        rest.classList.toggle("done", done);
        const count = rest.querySelector("[data-chapter-words]");
        if (count) {
          const words = allSegments.filter(item => item.chapterIndex === chapterIndex).length;
          count.textContent = ` · ${words} new word${words === 1 ? "" : "s"}`;
          count.hidden = !done;
        }
      });
    };
    const unlockThrough = index => {
      if (index <= maxIndex) return;
      const previous = maxIndex;
      maxIndex = index;
      allSegments.slice(previous + 1, maxIndex + 1).forEach(item => window.WORTWEG.markSeen(item.entry.w));
      save(); updateStats();
    };

    if (maxIndex >= 0) {
      allSegments.slice(0, maxIndex + 1).forEach(item => window.WORTWEG.markSeen(item.entry.w));
      if (maxIndex < allSegments.length - 1) {
        const resume = document.querySelector("[data-resume]");
        resume.hidden = false;
        const chapterNumber = allSegments[maxIndex].chapterIndex + 1;
        resume.querySelector("[data-resume-copy]").textContent = `Kapitel ${String(chapterNumber).padStart(2, "0")} · word ${maxIndex + 1} of ${allSegments.length}.`;
        resume.querySelector("[data-resume-go]").onclick = () => {
          allSegments[Math.min(maxIndex + 1, allSegments.length - 1)].element.scrollIntoView({ behavior: "smooth", block: "center" });
          resume.hidden = true;
        };
        resume.querySelector("[data-resume-dismiss]").onclick = () => { resume.hidden = true; };
      }
    }
    updateStats();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(item => {
          if (item.isIntersecting) unlockThrough(Number(item.target.dataset.index));
        });
      }, { rootMargin: "0px 0px -22% 0px", threshold: .25 });
      allSegments.forEach(item => observer.observe(item.element));
    } else {
      allSegments.forEach((item, index) => item.element.addEventListener("mouseenter", () => unlockThrough(index), { once: true }));
    }

    const drawer = document.querySelector("[data-vocab-drawer]");
    const drawerOpener = document.querySelector("[data-vocab-open]");
    const scrim = document.querySelector("[data-drawer-scrim]");
    const list = document.querySelector("[data-vocab-list]");
    const drawerCopy = document.querySelector("[data-drawer-copy]");
    const search = document.querySelector("[data-vocab-search]");
    const filter = document.querySelector("[data-star-filter]");
    const currentDrawerEntries = () => {
      const query = search.value.trim().toLocaleLowerCase("de-DE");
      return unlockedEntries().filter(entry => {
        if (starOnly && !window.WORTWEG.isStarred(entry.w)) return false;
        return !query || `${entry.a || ""} ${entry.w} ${entry.d}`.toLocaleLowerCase("de-DE").includes(query);
      });
    };
    const renderDrawer = () => {
      const entries = currentDrawerEntries();
      const collected = unlockedEntries().length;
      list.innerHTML = "";
      /* The explainer is for people who have nothing yet; once words arrive it
         is just a line of text sitting on top of the answer. */
      /* Hidden at zero: the list's own empty state already says "start reading",
         and stacking two sentences of the same meaning helped nobody. */
      if (drawerCopy) {
        drawerCopy.hidden = collected === 0 || collected > 3;
        drawerCopy.textContent = `${collected} word${collected === 1 ? "" : "s"} collected so far. More appear as you read.`;
      }
      if (!entries.length) {
        list.innerHTML = `<div class="drawer-empty">${maxIndex < 0 ? "Start reading to collect your first word." : "No collected words match this filter."}</div>`;
      }
      entries.forEach(entry => {
        const row = document.createElement("div");
        row.className = "drawer-word";
        row.innerHTML = `<div class="drawer-word-main"><strong lang="de">${reader.displayWord(entry)}</strong><span>${entry.d} · ${entry.l}</span></div><div class="drawer-word-actions"><button type="button" class="icon-button" data-drawer-speak aria-label="Hear ${entry.w} pronounced">${reader.icon("speak")}</button><button type="button" class="icon-button${window.WORTWEG.isStarred(entry.w) ? " on" : ""}" data-drawer-star aria-pressed="${window.WORTWEG.isStarred(entry.w) ? "true" : "false"}" aria-label="Star ${entry.w} for review">${reader.icon("star")}</button></div>`;
        reader.registerAudioControl(row.querySelector("[data-drawer-speak]")).onclick = () => reader.speak(entry.a ? `${entry.a} ${entry.w}` : entry.w);
        row.querySelector("[data-drawer-star]").onclick = event => {
          const on = window.WORTWEG.toggleStar(entry.w);
          event.currentTarget.classList.toggle("on", on);
          event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
          if (starOnly) renderDrawer();
        };
        list.appendChild(row);
      });
      document.querySelector("[data-review-game]").disabled = !entries.length;
      document.querySelector("[data-review-cards]").disabled = !entries.length;
    };

    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;
    const drawerIsOpen = () => drawer.classList.contains("open");
    const openDrawer = () => {
      lastFocused = document.activeElement;
      renderDrawer();
      drawer.removeAttribute("inert");
      drawer.classList.add("open");
      scrim.classList.add("on");
      drawerOpener.setAttribute("aria-expanded", "true");
      search.focus();
    };
    const closeDrawer = () => {
      drawer.classList.remove("open");
      scrim.classList.remove("on");
      drawer.setAttribute("inert", "");
      drawerOpener.setAttribute("aria-expanded", "false");
      /* document.body is what activeElement reports when the drawer was opened by
         a pointer, and focusing it goes nowhere — fall back to the control itself. */
      if (lastFocused?.isConnected && lastFocused !== document.body) lastFocused.focus();
      else drawerOpener.focus();
    };
    drawer.setAttribute("inert", "");
    drawerOpener.onclick = openDrawer;
    document.querySelector("[data-vocab-close]").onclick = closeDrawer;
    scrim.onclick = closeDrawer;
    document.addEventListener("keydown", event => {
      if (!drawerIsOpen()) return;
      /* The word popover owns Escape while it is up; the drawer takes the next one. */
      if (event.key === "Escape" && !document.getElementById("word-popover")?.classList.contains("show")) {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...drawer.querySelectorAll(FOCUSABLE)].filter(node => node.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    search.oninput = renderDrawer;
    filter.onclick = () => {
      starOnly = !starOnly;
      filter.classList.toggle("on", starOnly);
      filter.setAttribute("aria-pressed", starOnly ? "true" : "false");
      renderDrawer();
    };

    const voiceSelect = document.querySelector("[data-voice-select]");
    const rateInput = document.querySelector("[data-speech-rate]");
    const rateValue = document.querySelector("[data-speech-rate-value]");
    const voiceTest = document.querySelector("[data-voice-test]");
    voiceTest.innerHTML = reader.icon("play");
    const populateVoices = () => {
      const voices = reader.voices();
      const selected = reader.getSpeechSettings().voice;
      const unavailable = reader.speechStatus() !== "ok";
      voiceSelect.innerHTML = voices.length
        ? voices.map(voice => `<option value="${voice.name}">${voice.name}${voice.localService ? "" : " · online"}</option>`).join("")
        : '<option value="">No German voice installed</option>';
      voiceSelect.disabled = unavailable;
      if (voices.some(voice => voice.name === selected)) voiceSelect.value = selected;
      else if (voices[0]) reader.setSpeechVoice(voices[0].name);
    };
    populateVoices();
    document.addEventListener("wortweg-voices", populateVoices);
    voiceSelect.onchange = () => reader.setSpeechVoice(voiceSelect.value);
    rateInput.value = reader.getSpeechSettings().rate;
    rateValue.textContent = `${Number(rateInput.value).toFixed(2)}×`;
    rateInput.oninput = () => {
      reader.setSpeechRate(rateInput.value);
      rateValue.textContent = `${Number(rateInput.value).toFixed(2)}×`;
    };
    reader.registerAudioControl(voiceTest).onclick = () => reader.speak("Guten Morgen. Ich lerne Deutsch.");

    /* An inline confirmation instead of the browser's own dialog, so the one
       destructive action in the product stays inside the product. */
    const resetButton = document.querySelector("[data-reset-course]");
    const resetConfirm = document.querySelector("[data-reset-confirm]");
    resetButton.onclick = () => {
      resetConfirm.hidden = false;
      resetButton.hidden = true;
      resetConfirm.querySelector("[data-reset-yes]").focus();
    };
    document.querySelector("[data-reset-no]").onclick = () => {
      resetConfirm.hidden = true;
      resetButton.hidden = false;
      resetButton.focus();
    };
    document.querySelector("[data-reset-yes]").onclick = () => {
      try { localStorage.removeItem(progressKey); }
      catch (_) {}
      location.reload();
    };

    const launchReview = page => {
      const entries = currentDrawerEntries();
      if (!entries.length) return;
      try { localStorage.setItem("wortweg-custom-set", JSON.stringify({ words: entries.map(entry => entry.w), label: starOnly ? "starred course words" : "collected course words" })); }
      catch (_) {}
      location.href = `${page}?custom=1`;
    };
    document.querySelector("[data-review-game]").onclick = () => launchReview("game.html");
    document.querySelector("[data-review-cards]").onclick = () => launchReview("cards.html");
    window.WORTWEG.onChange(() => { updateStats(); if (drawerIsOpen()) renderDrawer(); });

    const readAll = document.querySelector("[data-read-all]");
    reader.registerAudioControl(readAll).onclick = () => {
      let current = root.querySelector(".course-chapter");
      document.querySelectorAll(".course-chapter").forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .45) current = section; });
      const chapterIndex = Number(current.id.replace("kapitel-", "")) - 1;
      reader.speak(story.chapters[chapterIndex].segments.map(segment => segment.de).join(" "));
    };
  };

  courseMode ? renderCourse() : renderStandardStory();

  /* State declared up front, not on first click: a screen reader could not tell
     this was a toggle, let alone which way it was set. */
  document.querySelector("[data-toggle-translations]")?.setAttribute("aria-pressed", "false");
  document.querySelector("[data-toggle-translations]")?.addEventListener("click", event => {
    const on = document.body.classList.toggle("show-translations");
    event.currentTarget.classList.toggle("on", on);
    event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (!courseMode) {
    const readAll = document.querySelector("[data-read-all]");
    if (readAll) {
      reader.registerAudioControl(readAll).addEventListener("click", () => {
        const text = story.chapters.flatMap(chapter => chapter.paragraphs.map(item => item.de)).join(" ");
        reader.speak(text);
      });
    }
  }

  const progress = document.querySelector(".progress-track span");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
})();
