# Mnemosyne OS Benchmarks

Transparency archive for the benchmark campaigns run against the memory engine
of [Mnemosyne OS](https://github.com/Mnemosyne-OS/Mnemosyne-Neural-OS). Each
campaign ships its methodology, its caveats and the raw run logs behind every
published number.

> **📊 [Live results page →](https://mnemosyne-os.github.io/MnemosyneOS---benchmarks/verification-kit/)**
> The numbers, the per-question ledger, and how to recompute them yourself.

**Why a separate repo:** a benchmark claim deserves more scrutiny than a product
README can give it. Everything here is real run output, so you can check the
numbers instead of trusting them.

> **Erratum, 2026-09-28.** An external audit by Julien Gelee found a wrong
> verdict and several sentences that claimed more than the files show. The
> August scores went from 77.1 % to 72.9 % (strict) and from 81.3 % to 77.1 %
> (flexible). Everything that changed is in [ERRATUM.md](ERRATUM.md).

## The numbers

| Benchmark | Score | Judge | Campaign |
|---|---|---|---|
| LongMemEval-M, full haystack, holdout, pre-registered | **77.1 %** (37/48) | official LongMemEval (gpt-4o) | [2026-10](longmemeval-rerun-2026-10/SUMMARY.md) |
| LongMemEval-M, full haystack, dev, pre-registered | **85.4 %** (41/48) | strict (gemini-3.5-flash) | [2026-10](longmemeval-rerun-2026-10/SUMMARY.md) |
| LongMemEval-M, full haystack | **72.9 %** (35/48) | strict (gemini-2.5-flash) | [2026-08](lexical-2026-08/SUMMARY.md) |
| LongMemEval-M, full haystack | **77.1 %** (37/48) | flexible, same answers | [2026-08](lexical-2026-08/SUMMARY.md) |
| LongMemEval-M, full haystack | **72.9 %** (35/48), composed | flexible | [2026-07](fullhaystack-2026-07/SUMMARY.md) |
| BEAM, 100K tier | **61.7 %** (400 questions) | BEAM's official judge | [2026-09](beam-2026-09/SUMMARY.md) |
| BEAM, 10M tier | **49.2 %** (200 questions) | BEAM's official judge | [2026-09](beam-2026-09/SUMMARY.md) |

Each score names its judge. Two judges grade the same answers differently, so
two scores from two judges never form a progression.

The 2026-10 rerun followed a protocol published before it ran. Its holdout
set had never been answered before. Its dev set is the 48 questions of the
earlier campaigns. The two dev scores differ by the engine, the reader and the
strict judge's model at once, so they do not measure one change.

## Recompute the numbers yourself

The [**verification kit**](verification-kit/) ships the exact grader, the
per-question verdicts behind each LongMemEval score, and a tool that recomputes
the accuracy from those verdicts. The 2026-10 rerun has its own
[`verify.js`](longmemeval-rerun-2026-10/verify.js), and so does the BEAM
campaign ([`verify.js`](beam-2026-09/verify.js)). All three run offline, with no
memory engine and no dependencies:

```bash
cd verification-kit
node verify.js               # recompute every LongMemEval score from its rows
node scoring.js --selftest   # audit the grader on real cases

cd ../beam-2026-09
node verify.js               # recompute 61.7 % and 49.2 % from their rows
```

`verify.js` proves each advertised score is the **exact sum of the published
per-question rows**. Every ledger recomputes in full: baseline (64.6 %), engine
multi-session (5/8), local-sovereign (50 %), and the four arms of the August
campaign. Those four arms are vector-only and fused retrieval, each read by the
strict and the flexible judge (29/48, 35/48, 34/48, 37/48). The BEAM script
exits non-zero on the first mismatch.

### LongMemEval: the August run and the July composition

**The August headline is 72.9 % (35/48), strict judge.** The fused arm ran
twice on the same 48 questions, and a HIT counts only if both runs are a HIT.
Two verdicts were overturned by a human audit on 2026-09-27/28, listed in
[`lexical-2026-08/human-audit.json`](lexical-2026-08/human-audit.json).

July's *flexible* judge grades the same answers at 77.1 % (37/48), under the
same both-runs rule. `verify.js` recomputes that score from its own ledger.

The lexical channel gains **+9/−3** questions under the strict judge
(p = 0.146) and **+7/−4** under the flexible judge. Neither answer-side gain is
statistically significant. The retrieval gain is measured without any LLM: 48
questions never seen during development show +4/−0 evidence sessions. That
holdout measures retrieval only, not answers. The vector-only arm is one run,
never replayed.

**July's 72.9 % is a composed number, and `verify.js` prints its
composition.** Only the multi-session category was re-run with the engine. The
other 40 rows come from the baseline ledger. The tool prints
`30/40 carried + 5/8 measured = 35/48` on every run. It was also called a lower
bound until 2026-09-28. That claim is withdrawn: an August full-engine run of
the same 48 questions scored 34/48 under the same judge. Details are in the
kit's `RESULTS.md` and `METHODOLOGY.md §5`.

The August strict score and the July composition both come to 35/48. That is a
coincidence: different engine builds, different judges, different methods.
July's campaign stays as published, DOI-pinned, and the erratum applies to it.

### BEAM: 61.7 % and 49.2 %

[BEAM](https://github.com/mohammadtavakoli78/BEAM) (ICLR 2026) asks ten kinds
of memory questions, including abstention, contradiction and event ordering.
Mnemosyne OS was run at two of its tiers, 100K and 10M, graded by **BEAM's own
judge**.

**A 76× larger haystack costs 20 % of the score** (61.7 % at 100K, 49.2 % at
10M). The benchmark paper's own baselines lose 60 % over the same range. That
ratio compares Mnemosyne OS to itself on one rig, and it is what the campaign
is published for. Other systems report BEAM scores with their own reader and
judge, so those scores measure different setups. Details are in the
[campaign summary](beam-2026-09/SUMMARY.md).

**Rendered results page:
[mnemosyne-os.github.io/MnemosyneOS---benchmarks/verification-kit](https://mnemosyne-os.github.io/MnemosyneOS---benchmarks/verification-kit/)**.
The files in [`verification-kit/`](verification-kit/) are the source behind it.

## Campaigns

| Campaign | Headline | |
|---|---|---|
| [LongMemEval-M full-haystack](fullhaystack-2026-07/SUMMARY.md) (2026-07) | **64.6 % → 72.9 %**, multi-session recall **1/8 → 5/8** | [16 raw run logs](fullhaystack-2026-07/logs/) |
| [Lexical channel: hybrid retrieval, fully local](lexical-2026-08/SUMMARY.md) (2026-08) | strict judge **29/48 → 35/48** (fused arm reproduced ×2, p = 0.146, corrected 2026-09-28), retrieval holdout on 48 unseen questions **+4/−0 sessions, zero regressions** | [11 raw run files](lexical-2026-08/runs/) |
| [BEAM: how far the score falls when the haystack grows](beam-2026-09/SUMMARY.md) (2026-09) | BEAM's own judge: **61.7 %** at the 100K tier, **49.2 %** at 10M, a **20 % relative loss for a 76× larger haystack**. The benchmark paper's own baselines lose 60 % | [7 raw run files](beam-2026-09/runs/) + [`verify.js`](beam-2026-09/verify.js) |

## What "full-haystack" means

[LongMemEval](https://github.com/xiaowu0162/LongMemEval) is a public,
independent long-term-memory benchmark. Its **full-haystack** variant surrounds
the evidence of every question with ~480 distractor sessions from other
personas. It is the closest published setup to a real memory vault that has
been used for months. Most reported numbers, including the original paper's,
use the easier `-S` variant. The LongMemEval numbers of Mnemosyne OS above are
on the harder one.

## Ground rules for anything published here

1. **A HIT counts only if it replays.** Judge noise and sampling variance
   produce false positives, so every cited engine result was re-run. The
   comparison arms say when they rest on one run.
2. **One configuration, no cherry-picking.** A headline number comes from one
   uniform configuration across the full question set, never a best-of-N.
3. **Caveats stay attached to the number.** A lower bound or a trade-off is
   stated next to the score. Each campaign summary lists its caveats.

[`AGENTS.md`](AGENTS.md) writes these rules down as an enforceable contract:
the ledger format, the replay discipline, the rule that a composed figure is
always labelled as composed, and the checklist to pass before anything here is
updated. It addresses whoever publishes the next number, person or agent. It
is public for the same reason the logs are.

## Reproducing a campaign

This repo lets you audit the **scoring**: the grader, the per-question
verdicts, the arithmetic, the replay discipline, and every row traced back to
the public dataset.

Reproducing the **retrieval** requires the engine that produced the answers,
and that engine is closed. Re-running generation from this repo is therefore
out of reach, and we say so plainly.

The internal harness scripts depend on the core engine of Mnemosyne OS, so
they are kept out of this repo. They are available on **motivated request**:
open an issue on this repo and explain what you would like to verify or
extend.

The benchmark datasets are public and linked in each campaign summary. The logs
here are enough to check the scoring and the methodology against them.

## Further reading

The campaign write-ups, in plain language, on the product site:

- [AI memory compared: mem0, Zep, Letta, Cognee, Supermemory, us](https://mnemosyne-os.io/blog/agent-memory-tools-compared):
  where each published memory score comes from, with our BEAM rows next to the
  others and which judge graded each one.
- [72.9 % and the three questions we miss](https://mnemosyne-os.io/blog/full-haystack-72-9):
  the full-haystack run behind this repository, the protocol, the levers we
  refuted, and the questions we miss.
- [We gave personality control of memory. It cost 31 points.](https://mnemosyne-os.io/blog/personality-lens-31-points):
  the ablation that measured a feature making retrieval worse.
- [The benchmark page](https://mnemosyne-os.io/benchmark): the current
  published number and the claims it supports.

## License

- **Data**: logs, ledgers, summaries and documentation are under
  [CC-BY 4.0](LICENSE). Reuse them, cite them, requote the numbers, and credit
  the source.
- **Code**: `verification-kit/verify.js`, `scoring.js`, `index.html` and
  `beam-2026-09/verify.js` are under [MIT](LICENSE-CODE). You can fork the
  grader and check it against your own results.
- **Third-party data**: the `question`, `goldAnswer` and `rubric` fields inside
  the run files belong to the benchmarks. They are redistributed under their
  licences: [LongMemEval](https://github.com/xiaowu0162/LongMemEval) (MIT) and
  [BEAM](https://github.com/mohammadtavakoli78/BEAM) (MIT). Our CC-BY covers
  what we measured. The benchmark text stays under its authors' licence.
