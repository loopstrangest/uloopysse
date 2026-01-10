# Collaborative Puzzle Game Research

## Core Concept

A **two-player pure collaboration game** with:
- Each player receives **different partial information**
- Players must **communicate and share** to find the answer
- **Both players submit the same answer** to advance
- End-of-game stats show who typed first, solve times, etc.
- **Many different game TYPES** (5-10 levels each)
- Leverages the medium: **real-time internet collaboration**

### Why Pure Collaboration?

The asymmetry problem: if A shares their clue with B, then B has all the info but A doesn't. This makes "first to answer" unfair. Instead:
- Both must communicate to solve
- Both submit when ready
- Fun stats at the end (who typed first, average solve time, etc.)

---

## Game Types

Each type is a distinct mini-game with 5-10 levels. Players rotate through different types to keep things fresh.

---

### Type 1: Compound Words (5-10 levels)
**Classic word combination - no internet needed**

| Player A | Player B | Answer |
|----------|----------|--------|
| "pan" | "cake" | pancake |
| "sun" | "flower" | sunflower |
| "butter" | "fly" | butterfly |

**Scaling:** Common → Uncommon → Obscure compounds

---

### Type 2: Document Extraction (5-10 levels)
**One gets a URL, other gets extraction instructions**

| Player A | Player B | Answer |
|----------|----------|--------|
| URL to a Wikipedia article | "First word of the 3rd paragraph" | [word] |
| URL to a news article | "The author's last name" | [name] |
| URL to a poem | "The last word of line 7" | [word] |

**Why it works:** A can't solve without B's instruction. B can't solve without A's document.

**Scaling:** Longer documents, more complex extraction ("the 2nd capitalized word after 'however'")

---

### Type 3: Coordinates (5-10 levels)
**One gets location, other gets what to find**

| Player A | Player B | Answer |
|----------|----------|--------|
| "40.7128° N, 74.0060° W" | "What city?" | New York |
| Google Maps link | "Name of the nearest restaurant" | [name] |
| "Eiffel Tower" | "What year was it built?" | 1889 |

**Why it works:** A has where, B has what to look for.

---

### Type 4: Wikipedia Race (5-10 levels)
**Navigation puzzle using Wikipedia's link structure**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Start: https://en.wikipedia.org/wiki/Banana" | "End: https://en.wikipedia.org/wiki/France" | [number of clicks] |
| "Start: Cat" | "What's the 3rd link on that page?" | [article name] |

**Why it works:** One has the starting point, other has the destination or task.

---

### Type 5: Split Image (5-10 levels)
**Each sees half of an image**

| Player A | Player B | Answer |
|----------|----------|--------|
| Left half of Mona Lisa | Right half of Mona Lisa | Mona Lisa |
| Top half of Eiffel Tower | Bottom half of Eiffel Tower | Eiffel Tower |
| Zoomed corner of famous photo | Different zoomed corner | [photo name] |

**Why it works:** Must describe what you see to piece it together.

**Scaling:** Famous images → Obscure images → Abstract art

---

### Type 6: Audio Description (5-10 levels)
**One hears audio, must describe to partner who has answer choices**

| Player A | Player B | Answer |
|----------|----------|--------|
| [Audio clip of bird] | "Is it a: crow, sparrow, eagle, or owl?" | sparrow |
| [Famous movie quote audio] | "Which movie?" | [movie name] |
| [Song instrumental] | "What song?" | [song name] |

**Why it works:** A hears, B has options. A must describe, B must interpret.

---

### Type 7: Time Machine (5-10 levels)
**Historical lookups combining date + category**

| Player A | Player B | Answer |
|----------|----------|--------|
| "January 10, 1990" | "What was #1 on Billboard Hot 100?" | [song] |
| "July 20, 1969" | "What major event happened?" | Moon landing |
| "10 years ago today" | "Who was US President?" | [name] |

**Why it works:** Requires research using both pieces of info.

---

### Type 8: Translation Bridge (5-10 levels)
**One gets foreign text, other gets context**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Bonjour le monde" | "It's French. What does it mean?" | Hello world |
| "こんにちは" | "It's a greeting" | Hello (Konnichiwa) |
| [Text in unknown script] | "It's the capital of Japan" | Tokyo |

**Why it works:** A has the text, B has the context/language hint.

---

### Type 9: Cipher/Code (5-10 levels)
**One gets encoded message, other gets the key**

| Player A | Player B | Answer |
|----------|----------|--------|
| "KHOOR" | "Caesar cipher, shift 3" | HELLO |
| ".... . .-.. .--.." | "It's Morse code" | HELP |
| "01001000 01001001" | "It's binary → ASCII" | HI |

**Why it works:** Message is useless without key. Key is useless without message.

---

### Type 10: Math Relay (5-10 levels)
**One gets equation, other gets variable values**

| Player A | Player B | Answer |
|----------|----------|--------|
| "x + y = ?" | "x=5, y=3" | 8 |
| "Area of circle with radius r" | "r = 7, use π = 3.14" | 153.86 |
| "Solve for x: 2x + 10 = y" | "y = 20" | 5 |

**Why it works:** Neither can solve alone.

---

### Type 11: Stock/Company Lookup (5-10 levels)
**Real-time internet research**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Company that makes the iPhone" | "What's their stock ticker?" | AAPL |
| "TSLA" | "Who is the CEO?" | Elon Musk |
| "Largest company by market cap" | "What's their HQ city?" | [city] |

**Why it works:** A identifies, B knows what to look up.

---

### Type 12: Emoji Decode (5-10 levels)
**One gets emojis, other gets category**

| Player A | Player B | Answer |
|----------|----------|--------|
| "🌙 + 🚶" | "It's a song by The Police" | Walking on the Moon |
| "🦁 + 👑" | "It's a Disney movie" | The Lion King |
| "🍕 + 🗼" | "It's an Italian city" | Pisa |

**Why it works:** Emojis are ambiguous without category. Category needs the emojis.

---

### Type 13: Before & After (5-10 levels)
**Word chain puzzle**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Comes after 'peanut'" | "Comes before 'scotch'" | butter |
| "Comes after 'sun'" | "Comes before 'glasses'" | sun + glasses? No... "light" works for neither... |

Actually, better version:

| Player A | Player B | Answer |
|----------|----------|--------|
| "_____ butter" | "butter _____" | (A: peanut, B: fly) Both: "butter" is the link |

Hmm, this needs refinement. Skip or redesign.

---

### Type 14: Lyrics Lookup (5-10 levels)
**Song identification via partial lyrics**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Never gonna give you up" | "Who sang this?" | Rick Astley |
| [Obscure lyric snippet] | "It's from the 1980s" | [song name] |
| "Bohemian _____" | "What's the missing word?" | Rhapsody |

**Why it works:** One has lyrics, other has the question about them.

---

### Type 15: Recipe Reverse (5-10 levels)
**Identify dish from partial ingredient lists**

| Player A | Player B | Answer |
|----------|----------|--------|
| "eggs, flour, milk" | "sugar, vanilla, baking powder" | Pancakes |
| "tomatoes, mozzarella" | "basil, olive oil" | Caprese salad |
| "rice, seaweed" | "raw fish, wasabi" | Sushi |

**Why it works:** Each has partial ingredients. Must combine to identify.

---

### Type 16: API/JSON Extraction (5-10 levels)
**For the technically inclined**

| Player A | Player B | Answer |
|----------|----------|--------|
| `{"user": {"name": "Alice", "age": 30}}` | "Extract user.name" | Alice |
| URL to public API | "Get the 'title' field of the first item" | [value] |
| GitHub repo URL | "How many stars does it have?" | [number] |

**Why it works:** One has data, other has extraction path.

---

### Type 17: Street View Detective (5-10 levels)
**Visual location identification**

| Player A | Player B | Answer |
|----------|----------|--------|
| Google Street View link | "What country is this?" | [country] |
| Photo of landmark | "What's the nearest major city?" | [city] |
| Image of storefront | "What do they sell?" | [category] |

**Why it works:** A has visual, B has the question.

---

### Type 18: Trivia Tag-Team (5-10 levels)
**Trivia where answer to Q1 is needed for Q2**

| Player A | Player B | Answer |
|----------|----------|--------|
| "What year did WWII end?" | "What movie won Best Picture that year?" | (A: 1945, B: The Lost Weekend) |
| "Capital of France?" | "What river runs through it?" | (A: Paris, B: Seine) |

**Why it works:** B's question depends on A's answer. Chain of knowledge.

---

### Type 19: Spot the Difference (5-10 levels)
**Each sees slightly different image**

| Player A | Player B | Answer |
|----------|----------|--------|
| Image with red ball | Same image, ball is blue | "What color is the ball? (must match)" |
| Room with 5 books | Room with 6 books | "How many books?" |

**Why it works:** Must communicate to find discrepancy.

---

### Type 20: Live Data Race (5-10 levels)
**Real-time data lookups**

| Player A | Player B | Answer |
|----------|----------|--------|
| "Current temperature in Tokyo" | "Is it above or below 20°C?" | [yes/no + actual temp] |
| "Current Bitcoin price" | "Round to nearest $1000" | [price] |
| "Top story on Hacker News right now" | "How many points does it have?" | [number] |

**Why it works:** Must look up live data and cross-reference.

---

## Summary: 20 Game Types

| # | Type | Internet? | Core Mechanic |
|---|------|-----------|---------------|
| 1 | Compound Words | No | A + B = word |
| 2 | Document Extraction | Yes | URL + instruction |
| 3 | Coordinates | Yes | Location + question |
| 4 | Wikipedia Race | Yes | Start + destination |
| 5 | Split Image | No | Half + half |
| 6 | Audio Description | No | Sound + choices |
| 7 | Time Machine | Yes | Date + category |
| 8 | Translation Bridge | Maybe | Text + language hint |
| 9 | Cipher/Code | No | Message + key |
| 10 | Math Relay | No | Equation + variables |
| 11 | Stock/Company | Yes | Company + lookup task |
| 12 | Emoji Decode | No | Emojis + category |
| 13 | Before & After | No | Word chain |
| 14 | Lyrics Lookup | Yes | Lyrics + question |
| 15 | Recipe Reverse | No | Ingredients A + B |
| 16 | API/JSON | Yes | Data + extraction path |
| 17 | Street View | Yes | Image + question |
| 18 | Trivia Tag-Team | Yes | Q1 answer feeds Q2 |
| 19 | Spot the Difference | No | Image A vs Image B |
| 20 | Live Data Race | Yes | Live lookup + verification |

---

## Game Flow Ideas

### Option A: Type Rotation
- Play 5 levels of Type 1, then 5 of Type 2, etc.
- Keeps things fresh, players know what to expect

### Option B: Random Mix
- Each level is a random type
- More variety, less predictable

### Option C: Player Choice
- After each level, vote on next type
- More agency, might slow down flow

### Option D: Themed Packs
- "Internet Detective" pack: Types 2, 3, 4, 11, 16, 17
- "Word Nerd" pack: Types 1, 8, 9, 12, 14
- "Visual Thinker" pack: Types 5, 6, 17, 19

---

## End-Game Stats

Since it's collaborative, fun stats instead of scores:

- **First Typer:** Who submitted the correct answer first (per level)
- **Speed Demon:** Fastest solve time
- **Slowpoke:** Longest solve time
- **Clutch:** Most answers submitted in final 5 seconds
- **Chatty:** Most messages sent
- **Silent Type:** Fewest messages sent
- **Perfect Sync:** Times both submitted within 1 second of each other
- **Carry:** One player typed first 80%+ of the time
- **Research Master:** Best on internet-required levels
- **Word Wizard:** Best on word-based levels

---

## Technical Considerations

### Level Data Structure
```javascript
{
  id: "compound-001",
  type: "compound_words",
  requiresInternet: false,
  clueA: { type: "text", value: "pan" },
  clueB: { type: "text", value: "cake" },
  answer: "pancake",
  acceptedAnswers: ["pancake", "pan cake"],
  timeLimit: 60,
  difficulty: 1
}
```

### Types Requiring Dynamic Data
Some types need real-time data:
- **Live Data Race:** Current prices, weather, etc.
- **Time Machine:** May need "today's date" calculations
- **Wikipedia Race:** Links change over time

These could use APIs or be pre-generated daily.

---

## Next Steps

1. **Pick 5 favorite types** to prototype first
2. **Create 5 levels** for each chosen type
3. **Build the clue display UI** (private to each player)
4. **Build the answer submission flow**
5. **Playtest** and see which types are most fun
6. **Add more types** based on feedback

---

## Sources

- [Codenames - Wikipedia](https://en.wikipedia.org/wiki/Codenames_(board_game))
- [Just One - Collaborative Word Guessing Game](https://friendsgamenight.com/just-one-collaborative-word-guessing-game/)
- [Best Word Based Party Games](https://tabletopbellhop.com/gaming-advice/best-word-games/)
- [Wavelength Review](https://www.cmyk.games/products/wavelength)
- [How to Solve a Rebus Puzzle](https://www.rebuses.co/how-to-solve-a-rebus-puzzle/)
- [Difficulty Design in Puzzle Games](https://purplesloth.itch.io/trails/devlog/968680/lets-talk-about-difficulty-design-in-puzzle-games)
- [The Art of Co-op Gameplay Mechanics](https://www.numberanalytics.com/blog/co-op-gameplay-mechanics)
