# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are English-speaking A1–B1 German learners studying independently. They use the product to build reading comprehension, vocabulary, grammar awareness, and pronunciation through contextual reading and short review sessions.

## Product Purpose

Wort für Wort is a free, open-source graded German reader. It helps learners move from understanding individual words to reading connected German through a 30-chapter course, an intermediate short story, instant vocabulary support, pronunciation, flashcards, and recognition games. Success means learners can keep reading with less interruption, retain useful vocabulary, and see their progress accumulate.

## Positioning

The product combines contextual stories with one-tap word explanations, audio, noun articles and plurals, saved reading progress, and review activities in a single no-account experience. Reading introduces vocabulary; flashcards and games reinforce the same learning material.

## Operating Context

Learners use the product independently in a web browser. The main workflow moves between reading graded stories, tapping words for immediate help, collecting or starring vocabulary, and reviewing those words through cards or the recognition board. Reading position, reached vocabulary, starred words, and preferences are stored locally in the browser.

## Capabilities and Constraints

- A 30-chapter graded course, “Ein Jahr in Berlin,” spanning practical A1–B1 learning bands.
- An additional A2–B1 short story, “Der letzte Zug.”
- Tap-to-explain vocabulary with English meanings, pronunciation, and noun article/plural details where applicable.
- Whole-story audio, translation controls, collected vocabulary, starring, search, flashcards, and a word-recognition game.
- Automatic progress and preference storage without requiring an account.
- A static HTML, CSS, and JavaScript implementation with browser speech synthesis.
- CEFR labels are practical learning guidance, not an official certification or exhaustive word list.
- The current name, domain, content, implementation, and visual identity may be improved; none is a permanent product constraint.

## Evidence on Hand

- The 30-chapter course in `course-data.js` and the additional short story in `german-data.js`.
- German vocabulary, English glosses, grammar details, and pronunciation data in `german-data.js`.
- Working reading, cards, game, and local-progress flows in the project’s HTML and JavaScript files.
- Software is currently distributed under the MIT License; learning content and the current visual identity are currently licensed under CC BY 4.0, as documented in `LICENSE` and `license.html`.
- No testimonials, customer claims, formal efficacy studies, or official CEFR certification are present and future work must not fabricate them.

## Product Principles

1. Teach German in context before isolating it for review.
2. Keep help immediate and lightweight so learners stay inside the reading flow.
3. Connect exposure, collection, and retrieval practice into one continuous learning loop.
4. Make independent study accessible without accounts, subscriptions, or setup friction.
5. Prefer honest learning guidance and observable product behavior over unsupported claims.
