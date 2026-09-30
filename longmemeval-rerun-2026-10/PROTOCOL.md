# LongMemEval-M rerun: protocol, fixed before the run

**Status: FROZEN on 2026-09-30.** Every field below is filled. The run
starts after the commit that publishes this file. Every run log names the commit it follows. Nothing in this file
changes once the run starts. A deviation is logged in the last section, with
its date and reason.

This protocol follows the five points Julien Gelee proposed in his audit
([Mnemosyne-Neural-OS#47](https://github.com/Mnemosyne-OS/Mnemosyne-Neural-OS/pull/47)).
It answers the corrections listed in [`../ERRATUM.md`](../ERRATUM.md).

## 1. What this run measures

LongMemEval-M, full-haystack variant: every question is answered against its
own haystack of about 480 sessions. Two retrieval arms of the same engine
build:

- **vector**: dense retrieval only.
- **fused**: dense retrieval fused with the BM25 lexical channel by Reciprocal
  Rank Fusion.

Both arms run twice. The result is published whatever it is.

## 2. Corpus

| Field | Value |
|---|---|
| File | `longmemeval_m_cleaned.json` |
| Size | 2,737,100,077 bytes |
| SHA-256 | `9d79e5524794a2e6900a3aa9cb7d9152c5a3e8319c9a87c25494ba1eacee495f` |
| Questions | 500, of which 30 are abstention questions (`_abs`) |
| Upstream code | [xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval) at `9e0b455` |

Anyone can check a downloaded copy against the SHA-256 above.

## 3. Questions

Two sets of 48, 96 questions in total. Every id is listed in `questions.json`
next to this file, with the set it belongs to.

- **dev (48).** The set of every earlier campaign, kept for comparison. 8 per
  category over the 6 answerable categories, 0 `_abs`. It was drawn among
  questions whose evidence was already ingested, which makes it about 13 points
  easier than the full set. It was used during development.
- **holdout (48).** Drawn from the 452 other questions: group by
  `question_type`, sort the ids lexicographically, take the first 8 of each
  type. It holds 5 `_abs` questions. No answer was ever generated on it. It was
  used three times to measure retrieval changes, so it is not a virgin sample.

The headline is reported per set, never merged into one number.

## 4. Engine build

| Field | Value |
|---|---|
| Monorepo commit | `f9cc5ba52410ab29eab58166cf75b99f872de5aa` (working tree clean under `packages/core-engine`) |
| `packages/core-engine/dist/index.js` SHA-256 | `ca95266d990bd39cdc28834a61a4b03370dbe50e01cdee08374593dff4b30a3f` |
| `CORE_ENGINE_VERSION` | `1.6.0` |

The engine is closed. These values let anyone check that every run of this
campaign used the same build: each run log prints them at start, and a
mismatch invalidates the run.

## 5. Ingestion

- Each question gets its own vault built from its haystack only.
- **Session ids are anonymized before ingestion.** The dataset's ids
  (`answer_…`, `sharegpt_…`) mark some evidence sessions. Each id is replaced
  by `s_` followed by the first 12 hex characters of
  SHA-256(`<salt>` + id). The salt is published after the run with the full
  mapping, so the mapping can be checked and nobody could predict it before.
  SHA-256 of the salt, fixed before the run:
  `8a5309dc094b2cd0c5519f1596c7368ff3358b85a3c06c956cff01702e43861e`.
- **Full engine.** Each haystack is sorted into topics, and each topic is
  consolidated into a ledger, question-blind. The session ids are anonymized
  after the sort and before any embedding the reader's retrieval uses. The
  ledgers quote no session id; this is checked on every ledger vault before
  the run.

| Field | Value |
|---|---|
| Sort model | `gemini-3.8-flash` (Vertex) |
| Consolidation model | `gemini-3.8-flash` (Vertex) |
| Consolidation prompt | the engine's own prompt, which asks for `###` headings, one per sub-topic |
| Consolidation mode | catch-up: every chunk of a topic is read, window by window, and the previous ledger is carried into the next window |
| Ledger storage | each ledger is cut at its headings and stored as one chronicle per section, with the engine's own rule (`splitLedgerSections`) |

The catch-up mode is what the app's dream reaches over its nights. The
earlier builds read only the first 40 chunks of each topic. On 2026-09-28 a
question failed because its evidence was chunk 84 of 158 of one topic.

A ledger is cut into sections because the embedder reads about 512 tokens. The
vector of a 10,000-character ledger only sees its first lines, so a fact near
the end was never retrieved. The cut follows the headings the writer put in
the ledger. A ledger of 2,000 characters or less stays whole. A section over
3,000 characters is cut again one heading level down when it has at least two
sub-headings.
- Session dates are kept. They are part of the benchmark.
- Consolidation, where the engine runs it, never sees the questions.

## 6. Answering

| Field | Value |
|---|---|
| Door | the SDK/MCP ask of the app (`executeQuery`), the door agents use. Not the app's chat, which serves fewer and longer sources with another prompt |
| Reader model | `gemini-3.8-flash` (Vertex), thinking budget 0, as the app sends it |
| Temperature | 0.2, the value the door sets |
| Retrieval | topK = 32 and `maxSourceChars` = 3,000, the retrieval profile a caller of the door may request; + 3 reserved consolidation slots, with no cap per topic |
| Question text | retrieval receives the bare question; the reader receives `(Today is <question_date>.) <question>`. The door has no other way to receive the date |
| Embeddings | e5-base, 768 dimensions |
| Lexical channel (fused arm) | BM25 k1 = 1.5, b = 0.75, RRF k = 60 |

The reader changes from earlier campaigns. Their reader, `gemini-2.5-pro`,
leaves Vertex on 2026-10-20. On the BEAM 100K tier, `gemini-3.8-flash` scored
higher than `gemini-3.1-pro-preview` under the same judge. So this run measures
a different reader, and its scores do not continue the earlier ones.

`maxSourceChars` is the value the app uses today for a cloud reader: the
per-source budget derived from the model's context window, capped at 3,000.

The retrieval path is the one the app's chat uses today. The engine is
reviewed before this protocol is frozen, and section 4 records the build that
review ends on.

The answer prompt is published verbatim in this folder before the run:
`answer-prompt.example.json` is the exact system prompt and prompt the reader
received for question `6a1eabeb`, captured without calling the model. The
instruction is the text before `--- MEMORY CONTEXT ---`; the sources and the
question change with each question.

An infrastructure failure (API error, timeout) is retried up to 3 times. After
that the question is scored MISS and listed as an infrastructure failure.

## 7. Judges

Two judges grade every answer, side by side. Neither sees the other's verdict.

1. **The official LongMemEval judge**, the headline.
   `src/evaluation/evaluate_qa.py` at `9e0b455`, used as is:
   `gpt-4o-2024-08-06`, temperature 0, max 10 tokens, one prompt per category,
   the question included, the abstention prompt for `_abs` ids. A verdict is
   YES when the reply contains "yes", as in the official code.
2. **Our strict judge**, for comparison with earlier campaigns:
   `verification-kit/scoring.js` → `judgePrompt(…, 'strict')`, judge model
   `gemini-3.5-flash`, temperature 0. It is a different model from the reader,
   so the reader never grades itself. It replaces `gemini-2.5-flash`, which
   leaves Vertex on 2026-10-20. It does not receive the question. That limit is
   stated wherever its score appears.

The substring heuristic of `scoring.js` is recorded and decides nothing.

## 8. Scoring rules

- A question is a HIT only if **both passes** are a HIT. This applies to both
  arms.
- Every disagreement between the two passes is listed with both answers.
- A human audit may overturn a judge verdict, only through `human-audit.json`,
  with the reason and the name of whoever found it. The score is published
  **before and after** the audit, side by side.
- The gain of the fused arm over the vector arm is a paired count (+gained /
  −regressed) with an exact two-sided sign test. Under about 5 questions per
  48, a gap is inside the noise measured on this bench and is reported as such.

## 9. What gets published

- Every answer, untruncated, for every pass, arm and question.
- Every raw judge reply, word for word, with the exact prompt sent.
- The anonymization salt and the full id mapping.
- The engine build values of section 4, printed by each run.
- The cost of the run, measured.
- Ledgers extracted by script, never written by hand, and a `verify.js` that
  recomputes every published number from them.

## 10. Deviations

Logged on 2026-09-30, after the run. The run itself went from 14:30 to
16:49 UTC the same day.

1. **The monorepo commit changed during the run.** Section 4 names
   `f9cc5ba52`. The run logs name `f9cc5ba52`, `4cdb41402`, `1785e0abe`,
   `419a8886e` and `e817b72c3`. Another working session committed changes to
   the app's image studio and neural map while the run was going. None of
   these commits touches `packages/core-engine` or the benchmark harness, and
   every run file records the engine dist SHA-256 fixed in section 4.
   `verify.js` checks the dist in every file.
2. **Section 9 asks for ledgers extracted by script.** The raw run files are
   published instead, untruncated, and `verify.js` reads them directly. There
   is no intermediate file to trust.
3. **Network.** For the first 35 minutes, some reader calls took up to 343
   seconds because of a slow network route to Vertex. One holdout question
   (`001be529`, vector arm, pass 2) failed once and succeeded on its retry,
   as section 6 allows. No question ended as an infrastructure failure.

## 11. What the development runs measured (dev set, before the freeze)

These runs used 24 of the 48 dev questions (8 multi-session, 8 temporal
reasoning, 8 knowledge update) and one pass. They chose the build above. They
are not the result.

| Change | Official judge | Strict judge | Kept |
|---|---|---|---|
| Catch-up ledgers cut into sections, against 40-chunk ledgers | +3 / −0 | not recomputed | yes |
| Consolidation prompt asks for `###` headings | 20 → 20 (+1 / −1) | 21 → 21 | yes |
| Bare question for retrieval, date to the reader only | 20 → 20 | 22 → 21 | yes |
| 4 reserved consolidation slots instead of 3 | 20 → 20 | 21 → 21 | no |
| At most 2 sections of one topic in the reserved slots | 5 → 5 on the 6 questions it touches | 5 → 6 | no |

The headings prompt is kept with no measured gain. On the development
machine's own dream vault, 11 of 25 long ledgers had no heading, so they
could not be cut. With the prompt, the writer put headings in all 1,002 long
ledgers of the bench.

One dev question, `gpt4_76048e76`, flips between passes on identical inputs.
It explains each +1 or −1 on the official judge above that is not named.

**Question text.** The date used to be prefixed to the question for retrieval
too. On one question it matched the `Date:` header of most chunks and pushed
the evidence from vector rank 55 to 803. On the 96 questions, with no ledgers
and no reader, the bare question served the complete evidence of 87 questions
against 83 with the prefix: 8 better, 2 worse, exact two-sided sign test
p = 0.11. On the answers of the 24 dev questions it changes nothing: official
20 → 20, strict 22 → 21, the only change being `gpt4_76048e76`. The bare
question is kept for the better retrieval.

**Before the freeze.**
- On 2026-09-29 the bench's cut (`split-ledgers.cjs`) was switched to the
  engine's own function. On the 1,286 ledgers of the development build both
  cut the same 6,135 sections.
- Both sets were built with this configuration on 2026-09-29 and 2026-09-30,
  96 of 96 with no failure. The anonymized vaults quote no session id
  (0 in 257,706 rows). The sort left 211 chunks unsorted in 16 questions,
  where the model's reply could not be read; none of them belongs to an
  evidence session. The SHA-256 of every vault is kept with the build.
- The build cost about 163 M input tokens and 19 M output tokens (sort and
  ledgers of the 96 questions), measured by the build itself.
- One pass of the fused arm was answered on the 48 dev questions with this
  build, before the freeze: official judge 40/48, strict judge 42/48. The dev
  set is the development set; this number is not the result.
- No answer has been generated on the holdout set.
