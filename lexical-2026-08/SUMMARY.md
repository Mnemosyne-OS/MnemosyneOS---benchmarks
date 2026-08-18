# lexical-2026-08 — the lexical retrieval channel, audited

**Claim under audit:** adding a second, fully local retrieval channel (Okapi
BM25 over a persistent inverted index, merged with the dense ranking by
Reciprocal Rank Fusion) moved the strict-judge score on LongMemEval-M
full-haystack from **29/48 to 37/48**, reproduced across two independent runs,
with the retrieval gain confirmed on a 48-question holdout never seen during
development.

Everything below is recomputable by a stranger:

```
cd ../verification-kit && node verify.js
```

## What each file is

| File | What it is |
| --- | --- |
| `runs/duel-full.rejudged.json` | Baseline arm: full engine, **vector-only** retrieval, 48 questions, per-question judge verdicts (flexible AND strict). |
| `runs/duel-full-lexfusion.json` | + lexical channel, run 1. Same answerer, judge, prompts, budget. |
| `runs/duel-full-lexfusion-r2.json` | + lexical channel, **run 2** — the independent replay behind every published HIT. |
| `runs/recall-control.json` | Deterministic retrieval measurement (no LLM), channel OFF, development sample. |
| `runs/recall-fusion.json` | Same, channel ON (first implementation: in-memory index). |
| `runs/recall-fusion-persistent.json` | Same, channel ON, **persistent index** — the shipped storage. `verify.js` asserts it reproduces the in-memory ranking question-by-question. |
| `runs/recall-hold-off.json` / `runs/recall-hold-on.json` | The **holdout**: 48 questions never seen during development, measured OFF and ON. |
| `runs/recall-post-fix.json` | After the app-isolation fix inside the channel — `verify.js` asserts the CORE-mode ranking did not move. |
| `runs/boost-off.json` / `runs/boost-on-v2.json` | The earlier **multiplier** experiment (2× cosine boost on exact-term matches), committed for context. It measured ~neutral and motivated rank fusion; it feeds **no headline**. |
| `extract-ledgers.mjs` | Derives the two `verification-kit/results/lexical-*.jsonl` ledgers from the run files. **No ledger row is written by hand** — re-run it and diff. |

## The numbers, and which instrument produced each

Two instruments, deliberately kept apart:

1. **Deterministic retrieval** (no LLM anywhere; byte-identical inputs give
   byte-identical outputs): evidence sessions 38/48 → 41/48, answer-bearing
   chunk 25/35 → 30/35 on the development sample; **+4/−0 sessions and +2/−0
   chunks, zero regressions, on the holdout**. This is the instrument.
2. **Strict LLM judge, end-to-end**: 29/48 → 37/48 under the replay rule (a
   HIT counts only if both independent runs agree — they agreed on all 48
   verdicts). Paired per-question: **+9 gained / −1 regressed**; exact
   binomial on 9-vs-1 flips gives **p = 0.0215**. This is the confirmation.

Do not conflate the two "regression" statements: the **holdout retrieval**
shows zero regressions; the **answer-side pair** on the development sample
shows one (−1), visible in `lexical-fusion-strict-48q.jsonl` via
`baseline_correct`.

## Caveats, printed next to the number

- The 48-question development sample runs **~13 points easier** than its
  parent set, and it was used during development. That is exactly why the
  holdout exists.
- The answer-side judge has a measured noise floor of **≈2.6 verdicts per 48**
  on byte-identical replays: a gap under ~5 questions is not resolvable by
  this bench. The +8 clears it; smaller deltas in these files should not be
  quoted as findings.
- Fusion parameters are the literature defaults (BM25 `k1=1.5`, `b=0.75`; RRF
  `k=60`), deliberately untuned.
- **No product comparison is claimed.** The baseline and treatment arms are
  both *our* montages under *our* protocol. Nothing here scores anyone else's
  product.

## Provenance

Runs executed 2026-08-15 → 2026-08-17 on the maintainer's machine (answerer:
Vertex `gemini-2.5-pro`; judge: `gemini-2.5-flash`; embeddings: e5-base 768D;
budget frozen at topK=32 + 3 reserved consolidation slots). Raw files are
committed verbatim; the ledgers are mechanical extractions from them.
