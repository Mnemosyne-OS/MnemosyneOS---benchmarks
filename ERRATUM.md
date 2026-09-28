# Erratum, 2026-09-28

On 2026-09-27 Julien Gelee (Koperateur) reported a wrong verdict in the August
LongMemEval ledgers. On 2026-09-28 he published a full audit of the claims in
this repository, as
[a pull request](https://github.com/Mnemosyne-OS/Mnemosyne-Neural-OS/pull/47)
on the product repo. This page lists what changed because of it.

He confirmed that every published total is the exact sum of its rows. The
corrections below are about verdicts and about sentences that claimed more than
the files show.

## The numbers that changed

| Published before | Now | Why |
|---|---|---|
| **77.1 %** (37/48), strict judge | **72.9 %** (35/48) | two judge verdicts overturned, see below |
| **81.3 %** (39/48), flexible judge | **77.1 %** (37/48) | the same two verdicts |
| strict gain **+9/−1**, p = 0.0215 | **+9/−3**, p = 0.146 | the same two questions become regressions |
| flexible gain **+7/−2** | **+7/−4**, p = 0.549 | idem |

Two of the new values equal old ones by coincidence. The August strict score
is now 35/48, the same 72.9 % as July's composed figure. The August flexible
score is now 37/48, the same 77.1 % as the old strict headline. Always read
the fraction and the judge next to the percentage.

The retrieval results do not change. They use no LLM and no judge: evidence
sessions 38/48 → 41/48, and on the 48-question holdout +4/−0 sessions.

## The two verdicts

`lexical-2026-08/human-audit.json` lists them. The run files keep the judge's
original words. The ledgers apply the audit, and every overturned row shows
both verdicts. `node verify.js` prints the list on every run.

- **`gpt4_76048e76`**, found by Julien Gelee. The expected answer is "bike".
  Both runs answer "you took care of your car first" and mention the bike
  later. Both judges said YES in both runs.
- **`6ade9755`**, found in the human audit that followed. The expected answer
  is "Serenity Yoga". Run 2 names the studio, then concludes the user is still
  searching for one. Run 1 is correct, so the question fails the both-runs
  rule.

We reviewed every other HIT of the fused arm. One more case is debatable,
`0edc2aef`: run 1 recommends Airbnb where the expected answer describes hotels,
while keeping every stated preference. We kept the judge's verdict. The
reasoning is in the audit file.

## The sentences that were wrong

1. **"72.9 % is a lower bound, a full re-run can only raise it."** Nothing
   showed that. The August full-engine run of the same 48 questions, under the
   same flexible judge, scored 34/48 = 70.8 %. The claim is withdrawn.
   72.9 % stays a composed number.
2. **"scoring.js is the whole grading logic."** The rule that decides between
   heuristic and judge was missing. It is now in the file as `finalVerdict()`:
   the judge decides every verdict, and the heuristic is recorded for
   reference. Two limits are now written down there. The judge never receives
   the question. "Strict" is the default branch of `judgePrompt`.
3. **"Every answer is graded twice."** Both graders run, but only the judge
   decides. In the ledgers, `match_type` used to carry the heuristic's label,
   which read as "the heuristic decided". The August ledgers now say
   `llm_judge` on every row and keep the heuristic's result in separate fields.
4. **"Replayed a second time with the same verdict on every question."** That
   holds for the fused arm only. The vector-only arm (29/48) is one run. The
   July baseline (31/48) is one run too, as its methodology already said.
5. **"Confirmed on a 48-question holdout."** The holdout measures retrieval
   only. It holds no answers and no verdicts.
6. **The substring heuristic matched "3" in "30"** and "4" in "14". The judge
   overruled every such case in our runs, so no published verdict changed.
   The heuristic now matches whole numbers only, and the self-test covers it.

## What comes next

We will rerun LongMemEval in full: the whole engine on all 48 questions in one
run, session ids anonymized before ingestion, a judge that receives the
question, and two passes. The result will be published whatever it is.

Julien also asked for the rule that combines heuristic and judge with the raw
judge outputs, the full `aae3761f` transcript, the holdout sampling rule and
the exact LongMemEval-M version. They will be added here.

The July campaign stays as published under its DOI. This erratum applies to it.

Thank you to Julien Gelee for reading the logs and for writing it all down.
