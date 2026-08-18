# Results

All numbers below are recomputable from this repo with `node verify.js` — including
the 72.9% headline, which is *composed* from two ledgers (see below).
Dataset: **LongMemEval-M**. Grader: `scoring.js` (heuristic + `flexible` LLM judge).

## Headline

| Configuration | Variant | Score | Published rows |
|---|---|---|---|
| **Full engine** (baseline + consolidation) | full-haystack | **72.9%** (35/48) — *composed, lower bound* | ✅ composed — see below |
| **Baseline** (retrieval only, no consolidation) | full-haystack | **64.6%** (31/48) | ✅ `results/baseline-longmemeval-m-48q.jsonl` |
| **Local sovereign** (3B on-device, zero cloud) | oracle sample | **50.0%** (6/12) | ✅ `results/local-sovereign-12q.jsonl` |

### How 72.9% is composed — read this before quoting it

**It was never measured in a single 48-question engine run.** Only the
multi-session category was re-run with the engine. The figure is:

| Part | Score | Source |
|---|---|---|
| 5 other categories, **carried unchanged from the baseline** — never retried with the engine | 30/40 | `results/baseline-longmemeval-m-48q.jsonl` |
| Multi-session, **measured with the engine** | 5/8 | `results/engine-multisession-8q.jsonl` |
| **Composed total** | **35/48 = 72.9%** | `node verify.js` recomputes this |

Two consequences, stated plainly:

1. **It is a lower bound.** The 40 carried questions were never retried with the
   engine, so a full re-run can only raise the number, not lower it.
2. **It is not a like-for-like single-run measurement**, and shouldn't be quoted
   as one. The composition is printed by `verify.js` on every run so it can't
   quietly detach from the number.

The engine's contribution is concentrated where memory actually gets hard —
**multi-session aggregation: 1/8 → 5/8**. Note that 1 of those 5 (`e831120c`)
was already a baseline HIT, so the engine's net recovery is **4 questions**.
See `METHODOLOGY.md §5` for the 3 remaining misses, and
`results/engine-multisession-8q.jsonl` for the per-question verdicts, both runs
behind each one, and the two first-run HITs that were discarded for not replaying.

## Lexical channel (campaign 2026-08) — hybrid retrieval, fully local

A second retrieval channel (Okapi BM25 over a persistent inverted index inside
the vault, fused with the dense ranking by RRF, literature defaults untuned)
was added and measured under a **strict** judge. Raw runs and the reading key
live in [`lexical-2026-08/`](../lexical-2026-08/SUMMARY.md); ledgers are
mechanical extractions (`extract-ledgers.mjs`), never hand-written.

| Measurement | Vector only | + lexical channel | Published rows |
|---|---|---|---|
| Evidence sessions retrieved (deterministic, dev sample) | 38/48 | **41/48** | `lexical-2026-08/runs/recall-*.json` |
| Answer-bearing chunk served (deterministic, 35 tracked) | 25/35 | **30/35** | idem |
| **Holdout** — 48 questions never seen in development | — | **+4/−0 sessions, +2/−0 chunks** | `lexical-2026-08/runs/recall-hold-*.json` |
| End-to-end, **strict** judge, both-runs replay rule | 29/48 | **37/48** (+9/−1 paired, p = 0.0215) | ✅ `results/lexical-baseline-strict-48q.jsonl` + `results/lexical-fusion-strict-48q.jsonl` |

Retrieval is the instrument (no LLM, byte-identical replays); the strict judge
is the confirmation (measured noise floor ≈2.6 verdicts/48 — deltas under ~5
questions are not resolvable here). The development sample runs ~13 points
easier than its parent set, which is exactly why the holdout exists. **No
product comparison is claimed**: both arms are our own montages under our own
protocol. `node verify.js` recomputes every cell above.

## Baseline, per category (full-haystack, 48q)

| Category | Score |
|---|---|
| Single-session (assistant) | 8/8 |
| Single-session (user) | 6/8 |
| Knowledge-update | 6/8 |
| Temporal reasoning | 5/8 |
| Single-session (preference) | 5/8 |
| Multi-session | 1/8 |
| **Overall** | **31/48 = 64.6%** |

## Reference points (kept separate on purpose)

| Reference | Setting | ~Score |
|---|---|---|
| Full engine, oracle-evidence vaults (no distractors) | easier | ~84% |
| Literature GPT-4o full-context | *easier* -S variant | ~60% |
| Local sovereign (3B, zero cloud) | oracle sample | ~50% |

> These are not compared like-for-like — the point of listing them is to be
> explicit about which variant each number belongs to, since that is exactly
> where memory benchmarks tend to get quietly inflated.
