# Methodology

This document describes exactly how Mnemosyne OS is benchmarked, so the numbers
can be judged — and independently recomputed — without access to the engine.

The design principle here is simple: **you should not have to trust us.** The
grader is published (`scoring.js`), the per-question verdicts are published
(`results/*.jsonl`), and a one-command tool recomputes the headline from those
verdicts (`verify.js`). What stays private is the memory engine that *produces*
the answers — not anything you need to check the scoring.

---

## 1. The benchmark

**LongMemEval** — a public benchmark for long-term memory in chat assistants
(question categories: single-session recall, preference-consistency, knowledge
updates, temporal reasoning, and multi-session aggregation). We report on the
**-M ("medium") set** and, critically, on its **full-haystack variant**: every
question is answered against **~480 distractor sessions** mixed in with the few
that actually contain the evidence.

> **Why full-haystack matters.** Many memory numbers you see quoted are on the
> *easier* oracle or -S variants, where only evidence (or little noise) is
> present. Full-haystack is the honest, hard setting — the model has to *find*
> the needle before it can answer. We report it on purpose.

The dataset itself is public. Download the official release and you have the
questions, the haystack sessions, and the ground-truth answers used below.

> Dataset: [LongMemEval](https://github.com/xiaowu0162/LongMemEval) (public
> release). The `question_id`s in `results/*.jsonl` are the official ids, so any
> row can be traced back to its question and ground truth in the public files.

---

## 2. What was measured

| Run | What it is | File |
|---|---|---|
| **Baseline** | Retrieval only (semantic search → LLM answer), **no consolidation engine**. The honest floor. | `results/baseline-longmemeval-m-48q.jsonl` |
| **Local sovereign** | The full path run **entirely on-device** with a 3B local model — zero cloud, no data leaves the machine. | `results/local-sovereign-12q.jsonl` |
| **Full engine** | Baseline + the memory-consolidation layer of Mnemosyne OS, **re-run on the multi-session category only** (8 of the 48 questions). Composed with the carried baseline rows this gives the headline — see §5. | `results/engine-multisession-8q.jsonl` |

**Models.** Answers: `gemini-2.5-pro` (cloud runs) or `Qwen2.5-3B` (local run).
Judge: `gemini-2.5-flash`. Embeddings: e5-base (768-dimensional). Retrieval:
top-32 chunks × 2400 chars for the cloud runs, top-5 for the local run.

---

## 3. How answers are graded

Two graders run on every answer. **The LLM judge decides; the heuristic is
recorded for reference.** `scoring.js` → `finalVerdict` writes this rule down.

1. **LLM judge** (`scoring.js` → `judgePrompt` / `parseJudgeVerdict`): the exact
   prompt sent to the judge model. The July campaign uses the **`flexible`**
   leniency. The August campaign publishes **`strict`**, which is the default
   branch of `judgePrompt`, and `flexible` beside it. The prompt includes the
   hard exception that an answer which declines or says "cannot determine" is
   scored **NO**. The judge receives the expected answer and the generated
   answer. It does **not** receive the question.
2. **Deterministic heuristic** (`scoring.js` → `scoreAnswer`): exact-substring,
   numeric/money/duration match, word-number equivalence, a fuzzy content-word
   overlap, and an abstention check. Run `node scoring.js --selftest` to watch
   it decide real-shaped cases. It never overrules the judge: a substring
   match cannot tell "bike first" from "car first, bike later".

The harness skips the judge for an empty answer or a ground truth that is
itself "not mentioned". The verdict is then scored MISS. In the August campaign
this happened 0 times out of 144 answers.

**Human audit.** A judge verdict that a human reading shows to be wrong is
overturned in a committed file, never in the run files:
`lexical-2026-08/human-audit.json`. The ledgers show both verdicts on the row,
and `verify.js` prints the list. Nothing is graded by a hidden or per-question
rule.

Until 2026-09-28 this section said "every answer is graded twice", and the
ledgers' `match_type` field carried the heuristic's label. That read as if the
heuristic decided some rows. It never did. See [`ERRATUM.md`](../ERRATUM.md).

---

## 4. Discipline (how we avoid fooling ourselves)

These rules are non-negotiable in every run:

1. **Replay before you cite.** LLM answers and the LLM judge are non-deterministic.
   A question counts as a HIT only if it reproduces on a re-run with the same
   config. Multiple false verdicts (judge noise, sampling) were caught and
   discarded this way.
2. **One config for the cited number.** No per-question cherry-picking — a single
   configuration is applied uniformly across the whole set.
3. **Question-blind memory.** The consolidation engine never sees the benchmark
   questions while it organises memory. It consolidates topics, not answers.
4. **Trace before you claim.** Every improvement was traced to the exact missing
   fact and its position in the corpus before being accepted; plausible-sounding
   levers that didn't survive a trace were rejected.

---

## 5. Results and honest framing

See `RESULTS.md` for the table. The headline:

- **Baseline (full-haystack, 48q): 64.6%** — a single measured run, fully
  published and independently recomputable from this repo (`node verify.js`).
- **Full engine: 72.9%** — the consolidation layer lifts multi-session
  aggregation from **1/8 to 5/8**; composed with the unchanged other categories
  this is **35/48 = 72.9%**.

**It is composed, not measured in one run.** Only the multi-session
category (8 questions) was re-run with the engine. The other 40 rows are carried
verbatim from the baseline ledger. There has never been a single 48-question run
of the full engine. `verify.js` prints this composition — `30/40 carried + 5/8
measured = 35/48` — every time it runs, so the number cannot quietly detach from
how it was built. Do not quote 72.9% as a measured 48-question engine result.

**Withdrawn on 2026-09-28: "it is a lower bound".** This section used to say
that a full engine re-run could only raise 72.9%. Nothing showed that. An
August full-engine run of the same 48 questions, under the same flexible judge,
scored 34/48 = 70.8% (`results/lexical-baseline-flexible-48q.jsonl`). The
engine build differs between July and August, so this does not measure July's
engine either. It is enough to show the claim was never established.

**A third thing worth stating plainly:** of the 5 multi-session HITs, one
(`e831120c`) was *already* a baseline HIT. The engine's net recovery is **4
questions**, not 5. The per-question rows make this checkable — every engine row
carries a `baseline_correct` field.

**Replay discipline, made auditable.** `results/engine-multisession-8q.jsonl`
names **both runs behind every verdict**, including the two first-run HITs that
were discarded for failing to reproduce:

- `gpt4_59c863d7` (model kits) — **judge noise**: the engine gave the *same*
  answer ("6 kits", ground truth "five") in both runs; the first judge scored it
  HIT, the replay scored it MISS. Scored MISS.
- `aae3761f` (road trips) — **answer variance**: the first run answered "15
  hours" (correct, scored HIT), the replay answered "11 hours" — it found only
  two of the three trips — and was correctly scored MISS. Scored MISS.

Both are kept visible in the ledger with their discarded verdict rather than
deleted. You may disagree with discarding them — the data to argue the other way
is published.

For reference points that are easy to over-claim on and that we deliberately
separate out:

- Public GPT-4o full-context baselines in the literature land around ~60% — but
  on the *easier* -S variant, not full-haystack.
- On oracle-evidence vaults (no distractors), the same engine reaches ~84%.
- Fully local (3B model, zero cloud): ~50% on a 12-question sample — the price
  of sovereignty, reported plainly rather than hidden.

**The three remaining full-engine misses are understood, not hand-waved.** Two
are benchmark-structural: the shared haystack mixes *other* personas'
first-person statements into the served text, so "I lead a project" from a
distractor is indistinguishable from the user's — a failure mode that **does not
exist in a real single-user vault**. The third is a write/read coverage
trade-off documented in our internal campaign record. None is a scoring artifact.

---

## 6. Reproducing / auditing

**Recompute our headline from our published rows (no engine, no network):**

```bash
node verify.js
```

This re-derives the accuracy and per-category breakdown from the per-question
verdicts and asserts they equal the claimed headline.

**Audit the grader itself against the public ground truth:**

```bash
node scoring.js --selftest
```

`scoring.js` holds the heuristic, the judge prompt and the rule that decides
between them. Point it at the public LongMemEval ground-truth answers and you
can check it is a fair grader. The one decision it does not hold is the human
audit, which lives in `lexical-2026-08/human-audit.json`.

**Trace any row to the public dataset.** Every `question_id` in `results/*.jsonl`
is the official LongMemEval id. Look it up in the public release to see the
question, the haystack, and the ground truth.

**Full untruncated answer transcripts** (all runs, including the full-engine
multi-session set) are available on motivated request — open an issue describing
what you'd like to verify. The excerpts in `results/*.jsonl` are trimmed for
readability; the verdicts they carry are the real graded verdicts.

---

## 7. What is *not* in this repo, and why

The harness that runs the memory engine is coupled to the private core of Mnemosyne OS
and is not published — it is not a standalone tool, and publishing it would
expose engine internals without adding anything you need to check the numbers.
Everything required to audit the **scoring and methodology** is here. Everything
required to reproduce the **generation** (the public dataset, the models named
above, the exact retrieval/judge settings) is described so an independent
implementation can be built and compared.
