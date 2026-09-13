# beam-2026-09 — BEAM, and how far the score falls when the haystack grows

**What was measured:** Mnemosyne's retrieval and answering pipeline run against
[BEAM](https://github.com/mohammadtavakoli78/BEAM) (ICLR 2026), at both tiers
the benchmark ships, scored by **BEAM's own official judge**.

| Tier | Corpus | Score | Questions |
| --- | --- | --- | --- |
| 100K | ~368 chunks per vault | **61.7%** | 400 / 400, 0 infrastructure failures |
| 10M | ~28,000 chunks per vault | **49.2%** | 200 / 200, 0 infrastructure failures |

**A 76× larger haystack costs 20% of the score.** That ratio, not either
absolute number, is what this campaign is published for. It compares one system
to itself on one rig, which is the only comparison here that survives the
objection in the caveats below.

Everything on this page recomputes from the per-question rows next to it:

```
node verify.js
```

It prints every figure, recomputes it from `runs/`, and **exits non-zero on the
first mismatch**. Three mutations were used to check that it can actually go red:
flipping one verdict, deleting one row, and marking one answer as an
infrastructure failure. Each one fails the run.

## What each file is

| File | What it is |
| --- | --- |
| `runs/beam-100K-full.answers.json` | 100K tier. One entry per question: the question, BEAM's rubric, BEAM's gold answer, what the pipeline replied, and the retrieval settings it replied under. |
| `runs/beam-100K-full.judged-gpt-4.1-mini.json` | The same 400 questions read by **BEAM's official judge**. This file is where 61.7% comes from. |
| `runs/beam-100K-full.judged-gemini-2.5-flash.json` | The **same 400 answers** read by a different judge, published so the judge's effect can be measured rather than asserted. |
| `runs/beam-100K-full.evidence.json` | Deterministic, no LLM anywhere: for each question where BEAM names the evidence-bearing sessions, whether the retrieved top-k contained them. |
| `runs/beam-10M-v1.answers.json` | 10M tier, same shape. |
| `runs/beam-10M-v1.judged-gpt-4.1-mini.json` | Official judge. This file is where 49.2% comes from. |
| `runs/beam-10M-v1.evidence.json` | Same deterministic evidence measurement at 10M. |
| `verify.js` | Recomputes everything above. No network, no dependencies, no memory engine. |

Configuration, identical on both tiers and asserted by `verify.js` rather than
described here: answering model `gemini-2.5-pro`, judge `gpt-4.1-mini`, topK 32,
2400 characters per source.

## The aggregation is BEAM's, and it is not a mean

A flat mean over questions gives a different number. BEAM scores per (chat,
category), then averages over chats, then over the ten categories — and
`event_ordering` is scored by a normalised Kendall tau rather than by the
judge's 0/1. `verify.js` reproduces that rule rather than approximating it.

## The judge is an instrument, not a detail

The 100K run was read twice, by two graders, over one unchanged set of answers:

- `gpt-4.1-mini` (BEAM's own): **61.7%**
- `gemini-2.5-flash`: **57.6%**
- **136 of 400 scored values change**, and on `contradiction_resolution` the two
  graders are **15.3 points apart**.

Both files are here. This is the single strongest reason not to read any
cross-vendor memory leaderboard as a ranking, ours included.

Two counts appear in `verify.js` and they are not the same question: 136 values
change, of which 132 are a changed 0/1 verdict — the remainder are
`event_ordering` rows, where the score is a tau. We publish 136 because it is
the count that moves the number.

## What is wrong with this campaign, in our own words

**The core build behind these two runs is not stamped.** Later arms in our lab
record which engine build produced them; these two predate that, so we cannot
prove from the files alone which build answered. Everything else — models,
judge, topK, source cap, question set — is recorded per row and asserted by
`verify.js`. If build provenance is what you need, these two runs do not have it.

**This is not a ranking and must not be read as one.** BEAM figures published by
other projects are self-reported, and no two share a reader model, a judge, or a
context budget. Ours went through BEAM's official judge, which says nothing about
what anyone else's went through. Comparing absolute scores across those entries
is not a thing the available evidence supports.

**The 100K evidence sample is thin.** BEAM names evidence-bearing sessions for
only 18 of the 400 questions at that tier, against 169 of 200 at 10M. The 100K
evidence percentages are computed over those 18 and `verify.js` prints the
denominator every time. Do not read them as a 400-question measurement.

**Higher numbers exist in our lab and are deliberately not the headline.** Other
arms of this campaign, with different answering models and prompt-side gates,
score above these two. They are not published here, so **do not take our word for
them either** — an unpublished number deserves exactly the scepticism this page
asks you to apply to everyone else's. The two runs published are the conservative
pair, on the configuration closest to what ships.

**The vaults are not here.** They are roughly 5 GB and rebuildable from BEAM's
public dataset, so shipping them would trade a large download for nothing. What
that means for reproduction is below.

## What "reproducible" means here, exactly

`verify.js` proves that **the published scores are the arithmetic of the
published rows** — no hidden questions, no dropped failures, no massaging. That
is the claim, and it is the whole claim.

It does **not** re-run the pipeline, and it cannot: that would need the vaults,
API credentials and about a day of wall-clock. And the questions, rubrics and
gold answers are BEAM's, not ours. Re-running the benchmark from scratch means
starting from [their repository](https://github.com/mohammadtavakoli78/BEAM).

## Attribution

BEAM is MIT-licensed, by Mohammad Tavakoli et al. (ICLR 2026). The `question`,
`goldAnswer` and `rubric` fields in every file here are theirs, redistributed
under that licence so the rows can be checked against what was actually asked.
The answers, verdicts, retrieval settings and timings are ours.
