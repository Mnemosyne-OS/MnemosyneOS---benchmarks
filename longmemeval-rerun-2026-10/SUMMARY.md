# LongMemEval-M rerun, 2026-10: results

Mnemosyne OS answered 37 of 48 holdout questions correctly (77.1 %) under the
official LongMemEval judge. The holdout questions had never been answered
before this run. The protocol was frozen and published before the run, in
commit `69c5bbc` of this repository.

This rerun answers Julien Gelee's audit of the July result
([Mnemosyne-Neural-OS#47](https://github.com/Mnemosyne-OS/Mnemosyne-Neural-OS/pull/47))
and follows the corrections in [`../ERRATUM.md`](../ERRATUM.md).

## Scores

A question counts as correct only when both passes are correct. Each set has
48 questions. "Fused" is dense retrieval fused with BM25; "vector" is dense
retrieval alone.

| Set | Judge | Fused | Vector |
|---|---|---|---|
| **holdout** | **official (gpt-4o)** | **37/48 (77.1 %)** | 38/48 (79.2 %) |
| holdout | strict (gemini-3.5-flash) | 38/48 (79.2 %) | 37/48 (77.1 %) |
| dev | official (gpt-4o) | 39/48 (81.3 %) | 38/48 (79.2 %) |
| dev | strict (gemini-3.5-flash) | 41/48 (85.4 %) | 38/48 (79.2 %) |

These are the scores after the human audit. Before it, the holdout scores are
the same, and three dev scores were one question higher (see below).

The holdout is the result. No answer had been generated on it before this run.
It was used three times earlier to measure retrieval only, so it is not a
virgin sample (PROTOCOL.md section 3). The dev set was used to choose the
engine configuration, and the protocol says it is about 13 points easier than
the full dataset.

## Compared with the July result

The erratum of 2026-09-28 corrected the July result to 35/48 (72.9 %) on the
dev set, under the strict judge prompt read by `gemini-2.5-flash`. The same
set under the same prompt, read by `gemini-3.5-flash`, now scores 41/48
(85.4 %).

Three things changed at once, so the gain cannot be split between them:

- **The reader.** July used `gemini-2.5-pro`, which leaves Vertex on
  2026-10-20. This run uses `gemini-3.8-flash`.
- **The strict judge model.** July's `gemini-2.5-flash` leaves Vertex on the
  same date. Both runs send the same strict prompt, and two models can grade
  the same answer differently.
- **The engine.** Each topic's ledger now reads every session of the topic,
  instead of the first 40 chunks. The ledger is written under headings and
  stored one section per heading. Retrieval runs on the bare question, and the
  date goes to the reader only. PROTOCOL.md section 11 lists what each change
  measured on the dev set.

## Fused against vector

The two arms are within the noise of this bench. On the holdout, fused gains
2 questions and loses 3 under the official judge (exact sign test p = 1.00).
On the dev set, fused gains 3 and loses none under the strict judge
(p = 0.25). A gap under about 5 questions per 48 is inside the noise measured
on this bench.

## Holdout by category, official judge, fused arm

| Category | Correct |
|---|---|
| single-session assistant | 8/8 |
| single-session user | 7/8 (abstention 3/3) |
| knowledge update | 8/8 (abstention 1/1) |
| multi-session | 5/8 (abstention 0/1) |
| temporal reasoning | 5/8 |
| single-session preference | 4/8 |

## Human audit

Four questions had a verdict overturned, all from YES to NO.
[`human-audit.json`](human-audit.json) gives the answer, the expected answer
and the reason for each one. In every case the judge accepted an answer that
said it could not tell, or that picked the wrong option. The audit read every
question where the two judges disagree and every YES given to an answer that
says it cannot tell. A wrong answer that both judges accepted is outside what
this audit read.

Two questions were left as judged on purpose, and the file says why. One would
have been overturned in our favour on an arguable reading. The other is a
counting question whose expected answer misses some of the kits the sessions
mention.

## Cost

Measured from the token counts each provider returned, for the 384 answers
and their 768 verdicts. A call cut off by the 180-second timeout returns no
count, so these figures are a floor:

- Reader: 7,044,356 input tokens, 61,885 output tokens.
- Official judge: 113,745 input tokens, 663 output tokens.
- Strict judge: 111,940 input tokens, 384 output tokens.

Building the engine's ledgers before the run cost about 163 M input tokens and
19 M output tokens (PROTOCOL.md section 11).

## Check it yourself

```bash
node verify.js
```

It needs Node and nothing else. It checks that the salt matches the hash
published before the run, and recomputes the 29,779 anonymized session ids.
It checks that every run used the same engine build and settings. It rebuilds
each verdict from the judge's raw reply, then recomputes every score above,
before and after the audit. It exits non-zero on the first mismatch.

| File | Content |
|---|---|
| [`PROTOCOL.md`](PROTOCOL.md) | the frozen protocol, and the deviations found after the run (section 10) |
| [`questions.json`](questions.json) | the 96 question ids, by set |
| [`answer-prompt.example.json`](answer-prompt.example.json) | the exact prompt the reader received for one question |
| [`runs/answers-*.json`](runs/) | every answer, untruncated, with the engine build it was produced with |
| [`runs/judged-*.json`](runs/) | every judge prompt and raw reply |
| [`human-audit.json`](human-audit.json) | the overturned verdicts and the reasons |
| [`salt.txt`](salt.txt), [`id-map.json`](id-map.json) | the anonymization salt, and every dataset session id with its anonymized id |

## Limits

- 48 questions per set. The noise of this bench is about 5 questions per 48.
- The run measures the SDK and MCP door that agents use, the one that calls
  `executeQuery`. The app's chat serves fewer, longer sources with another
  prompt, and is not what this run measures.
- LongMemEval-M, full-haystack variant only, with one reader.
