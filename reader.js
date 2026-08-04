(() => {
  const root = document.querySelector("[data-reader]");
  if (!root) return;
  const story = window.GERMAN_STORIES[root.dataset.reader];
  if (!story) return;
  const reader = window.GermanReader;

  document.title = `${story.title} · Wort für Wort`;
  document.querySelector("[data-story-title]").textContent = story.title;
  document.querySelector("[data-story-level]").textContent = story.level;
  document.querySelector("[data-story-intro]").textContent = story.intro;

  const makeParagraph = paragraph => {
    const wrapper = document.createElement("div");
    const line = document.createElement("p");
    line.className = "story-paragraph";

    const actions = document.createElement("span");
    actions.className = "line-actions";
    actions.innerHTML = '<button class="icon-button" type="button" aria-label="Read this sentence aloud">▶</button><button class="icon-button" type="button" aria-label="Show translation">EN</button>';
    actions.firstElementChild.onclick = () => reader.speak(paragraph.de);
    line.appendChild(actions);

    reader.tokenize(paragraph.de).forEach(token => {
      if (!token.entry) { line.append(document.createTextNode(token.text)); return; }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "word";
      button.textContent = token.text;
      button.setAttribute("aria-label", `Explain ${token.text}`);
      button.onclick = event => { event.stopPropagation(); reader.showWord(token.entry, button); };
      line.appendChild(button);
    });

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
    section.innerHTML = `<div class="chapter-kicker">Kapitel ${String(index + 1).padStart(2, "0")}</div><h2>${chapter.title}</h2>`;
    chapter.paragraphs.forEach(paragraph => section.appendChild(makeParagraph(paragraph)));
    root.appendChild(section);
  });

  document.querySelector("[data-toggle-translations]")?.addEventListener("click", event => {
    document.body.classList.toggle("show-translations");
    event.currentTarget.classList.toggle("on", document.body.classList.contains("show-translations"));
  });
  document.querySelector("[data-read-all]")?.addEventListener("click", () => {
    const text = story.chapters.flatMap(chapter => chapter.paragraphs.map(item => item.de)).join(" ");
    reader.speak(text);
  });

  const progress = document.querySelector(".progress-track span");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
})();
