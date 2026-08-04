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
  document.querySelector("[data-story-level]").textContent = story.level;
  document.querySelector("[data-story-intro]").textContent = story.intro;

  const wordButton = (token, focus = "") => {
    if (!token.entry) return document.createTextNode(token.text);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `word${token.entry.w === focus ? " fresh" : ""}`;
    button.textContent = token.text;
    button.lang = "de";
    button.setAttribute("aria-label", `Explain ${token.text}`);
    button.onclick = event => {
      event.stopPropagation();
      reader.showWord(token.entry, button);
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
      actions.innerHTML = '<button class="icon-button" type="button" aria-label="Read this sentence aloud">▶</button><button class="icon-button" type="button" aria-label="Show translation">EN</button>';
      actions.firstElementChild.onclick = () => reader.speak(paragraph.de);
      line.appendChild(actions);
      line.appendChild(tokenizedLine(paragraph.de));
      const translation = document.createElement("div");
      translation.className = "story-translation";
      translation.textContent = paragraph.en;
      actions.lastElementChild.onclick = () => translation.classList.toggle("show");
      wrapper.append(line, translation);
      return wrapper;
    };

    story.chapters.forEach((chapter, index) => {
      const section = document.createElement("section");
      section.className = "chapter";
      section.innerHTML = `<div class="chapter-kicker">Kapitel ${String(index + 1).padStart(2, "0")}</div><h2 lang="de">${chapter.title}</h2>`;
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
      section.innerHTML = `<header class="course-chapter-head"><div class="chapter-kicker">Kapitel ${String(chapterIndex + 1).padStart(2, "0")}</div><h2 lang="de">${chapter.title}</h2><p>${chapter.en}</p></header>`;

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
              <button type="button" data-focus-speak aria-label="Pronounce ${entry.w}" title="Hear pronunciation">🔊</button>
              <button type="button" class="course-star${window.WORTWEG.isStarred(entry.w) ? " on" : ""}" data-focus-star aria-label="Star ${entry.w}" title="Add to review">★</button>
            </div>
          </div>
          <p class="course-line" lang="de"></p>
          <div class="course-line-actions">
            <button type="button" data-line-speak>▶ Hear sentence</button>
            <button type="button" data-line-translate>EN Translation</button>
            <span class="story-translation">${segment.en}</span>
          </div>`;
        learning.querySelector(".course-line").appendChild(tokenizedLine(segment.de, entry.w));
        const spoken = entry.a ? `${entry.a} ${entry.w}` : entry.w;
        learning.querySelector("[data-focus-speak]").onclick = () => reader.speak(spoken);
        learning.querySelector("[data-focus-star]").onclick = event => event.currentTarget.classList.toggle("on", window.WORTWEG.toggleStar(entry.w));
        learning.querySelector("[data-line-speak]").onclick = () => reader.speak(segment.de);
        learning.querySelector("[data-line-translate]").onclick = event => {
          const translation = learning.querySelector(".story-translation");
          translation.classList.toggle("show");
          event.currentTarget.textContent = translation.classList.contains("show") ? "Hide translation" : "EN Translation";
        };
        section.appendChild(learning);
        allSegments.push({ element: learning, entry, chapterIndex, text: segment.de });
      });
      root.appendChild(section);
    });

    document.querySelector("[data-chapter-count]").textContent = story.chapters.length;
    document.querySelector("[data-segment-count]").textContent = allSegments.length;
    const unlockedCount = document.querySelector("[data-unlocked-count]");
    if (unlockedCount?.nextElementSibling) unlockedCount.nextElementSibling.textContent = `of ${allSegments.length} words reached`;

    const finish = document.createElement("section");
    finish.className = "course-finish";
    finish.innerHTML = `<b lang="de">Geschafft.</b><p>You reached all ${allSegments.length} featured words across 30 chapters. Keep the ones that still feel new in your starred deck.</p>`;
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
      catch (_) {}
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
        link.querySelector(".toc-check").textContent = done ? "✓" : current ? "→" : "";
        if (done) completed += 1;
      });
      document.querySelector("[data-toc-progress]").textContent = `${completed} / ${story.chapters.length}`;
    };
    const updateStats = () => {
      document.querySelector("[data-unlocked-count]").textContent = Math.max(0, maxIndex + 1);
      document.querySelector("[data-vocab-count]").textContent = unlockedEntries().length;
      document.querySelector("[data-star-count]").textContent = window.WORTWEG.starred().length;
      document.querySelectorAll("[data-focus-star]").forEach((button, index) => button.classList.toggle("on", window.WORTWEG.isStarred(allSegments[index].entry.w)));
      updateToc();
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
        resume.querySelector("[data-resume-copy]").textContent = `You reached word ${maxIndex + 1} of ${allSegments.length}.`;
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
    const scrim = document.querySelector("[data-drawer-scrim]");
    const list = document.querySelector("[data-vocab-list]");
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
      list.innerHTML = "";
      if (!entries.length) {
        list.innerHTML = `<div class="drawer-empty">${maxIndex < 0 ? "Start reading to collect your first word." : "No collected words match this filter."}</div>`;
      }
      entries.forEach(entry => {
        const row = document.createElement("div");
        row.className = "drawer-word";
        row.innerHTML = `<div class="drawer-word-main"><strong lang="de">${reader.displayWord(entry)}</strong><span>${entry.d} · ${entry.l}</span></div><div class="drawer-word-actions"><button type="button" data-drawer-speak aria-label="Pronounce ${entry.w}">🔊</button><button type="button" data-drawer-star class="${window.WORTWEG.isStarred(entry.w) ? "on" : ""}" aria-label="Star ${entry.w}">★</button></div>`;
        row.querySelector("[data-drawer-speak]").onclick = () => reader.speak(entry.a ? `${entry.a} ${entry.w}` : entry.w);
        row.querySelector("[data-drawer-star]").onclick = event => {
          event.currentTarget.classList.toggle("on", window.WORTWEG.toggleStar(entry.w));
          if (starOnly) renderDrawer();
        };
        list.appendChild(row);
      });
      document.querySelector("[data-review-game]").disabled = !entries.length;
      document.querySelector("[data-review-cards]").disabled = !entries.length;
    };
    const openDrawer = () => {
      renderDrawer(); drawer.classList.add("open"); scrim.classList.add("on");
      drawer.setAttribute("aria-hidden", "false"); search.focus();
    };
    const closeDrawer = () => {
      drawer.classList.remove("open"); scrim.classList.remove("on"); drawer.setAttribute("aria-hidden", "true");
    };
    document.querySelector("[data-vocab-open]").onclick = openDrawer;
    document.querySelector("[data-vocab-close]").onclick = closeDrawer;
    scrim.onclick = closeDrawer;
    search.oninput = renderDrawer;
    filter.onclick = () => { starOnly = !starOnly; filter.classList.toggle("on", starOnly); renderDrawer(); };
    const voiceSelect = document.querySelector("[data-voice-select]");
    const rateInput = document.querySelector("[data-speech-rate]");
    const rateValue = document.querySelector("[data-speech-rate-value]");
    const populateVoices = () => {
      const voices = reader.voices();
      const selected = reader.getSpeechSettings().voice;
      voiceSelect.innerHTML = voices.length ? voices.map(voice => `<option value="${voice.name}">${voice.name}${voice.localService ? "" : " · online"}</option>`).join("") : '<option value="">System German voice</option>';
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
    document.querySelector("[data-voice-test]").onclick = () => reader.speak("Guten Morgen. Ich lerne Deutsch.");
    document.querySelector("[data-reset-course]").onclick = () => {
      if (!confirm("Reset your saved course position? Starred and known words will stay saved.")) return;
      localStorage.removeItem(progressKey);
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
    window.WORTWEG.onChange(() => { updateStats(); if (drawer.classList.contains("open")) renderDrawer(); });

    document.querySelector("[data-read-all]").textContent = "▶ Read current chapter";
    document.querySelector("[data-read-all]").onclick = () => {
      let current = root.querySelector(".course-chapter");
      document.querySelectorAll(".course-chapter").forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .45) current = section; });
      const chapterIndex = Number(current.id.replace("kapitel-", "")) - 1;
      reader.speak(story.chapters[chapterIndex].segments.map(segment => segment.de).join(" "));
    };
  };

  courseMode ? renderCourse() : renderStandardStory();

  document.querySelector("[data-toggle-translations]")?.addEventListener("click", event => {
    document.body.classList.toggle("show-translations");
    event.currentTarget.classList.toggle("on", document.body.classList.contains("show-translations"));
  });
  if (!courseMode) {
    document.querySelector("[data-read-all]")?.addEventListener("click", () => {
      const text = story.chapters.flatMap(chapter => chapter.paragraphs.map(item => item.de)).join(" ");
      reader.speak(text);
    });
  }

  const progress = document.querySelector(".progress-track span");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
})();
