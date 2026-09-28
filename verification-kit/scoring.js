/**
 * scoring.js — the exact grader used to score every Mnemosyne OS benchmark run.
 *
 * It holds a deterministic heuristic pass (exact / numeric / fuzzy / abstention
 * matching), the LLM-judge prompt, its verdict parser, and finalVerdict(), the
 * rule that says which of the two decides. It depends on nothing — no memory
 * engine, no network. It is published verbatim so the grading can be audited
 * and re-run against the public LongMemEval ground truth.
 *
 * Entry points:
 *   scoreAnswer(groundTruth, generated, sourcesCount) -> { correct, matchType, abstained }
 *   judgePrompt(groundTruth, generated, leniency)     -> the exact string sent to the judge model
 *   parseJudgeVerdict(reply)                          -> boolean (last YES/NO wins)
 *   finalVerdict(groundTruth, generated, judgeVerdict)-> the verdict a ledger records
 *
 * Two limits, stated here so nobody has to find them (reported by Julien Gelee,
 * 2026-09-28): the judge prompt carries the expected answer and the generated
 * answer, and NOT the question; and "strict" is the default branch of
 * judgePrompt (any leniency other than "flexible" or "lenient").
 *
 * Until 2026-09-28 this header called the file "the WHOLE grading logic". The
 * rule combining heuristic and judge was missing, so that was wrong.
 *
 * Run `node scoring.js --selftest` to see the grader decide a handful of cases.
 */

const WORD_TO_NUMBER = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12' };

// Phrases that count as "the assistant declined / said it does not know".
const ABSTAIN_MARKERS = [
  'do not know', "don't know", 'not mentioned', 'did not mention', 'not specified',
  'no information', "i don't have", 'i do not have', 'cannot find', 'unable to find',
  'cannot answer', 'can not answer', 'unable to answer',
  'cannot determine', 'unable to determine', 'not possible to determine',
  'does not contain', 'does not include', 'does not provide', 'does not mention',
  'no mention', 'not explicitly', 'not stated',
  'cannot provide', 'do not have access', "don't have access",
  'aucune information', 'je ne sais pas', 'pas mentionné',
  'ne contient pas', 'ne peux pas répondre', 'impossible de déterminer',
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function looksAbstained(generated) {
  const g = generated.toLowerCase();
  return ABSTAIN_MARKERS.some((m) => g.includes(m));
}

// Some ground-truth answers ARE "the user did not mention X" — for those,
// abstaining is the correct behaviour, not a miss.
export function abstentionExpected(groundTruth) {
  const a = groundTruth.toLowerCase();
  return a.includes('did not mention') || a.includes('do not know') || a.includes('not specified');
}

export function scoreAnswer(groundTruth, generated, sourcesCount) {
  const answerLower = groundTruth.toLowerCase().trim();
  const genLower = generated.toLowerCase().trim();
  const abstained = looksAbstained(generated) || (!genLower && sourcesCount === 0);

  if (abstentionExpected(groundTruth)) {
    return abstained ? { correct: true, abstained: true, matchType: 'abstained' }
                     : { correct: false, abstained: false, matchType: 'miss' };
  }
  if (abstained) return { correct: false, abstained: true, matchType: 'abstained' };
  if (!genLower)  return { correct: false, abstained: false, matchType: 'miss' };

  // Numeric questions (counts, money, durations) grade on the number itself.
  const monetaryStripped = answerLower.replace(/[$€£¥]/g, '');
  const numericRaw = monetaryStripped.match(/\b(\d[\d.,]*\d|\d|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/)?.[0] ?? '';
  const cleanNum = numericRaw.replace(/[,\s]/g, '');
  const normalizedNum = WORD_TO_NUMBER[cleanNum] || cleanNum;
  if (normalizedNum.length >= 1 && numericRaw) {
    const genNumClean = genLower.replace(/,/g, '');
    // A number matches only as a whole number: "3" must not match "30", "13",
    // "3.5", "3,000" or "Source 33". `\b` alone is not enough, because "." and
    // "," are non-word characters, so the digits on either side are excluded
    // explicitly. A zero decimal part is the same number ("$185" = "$185.00").
    // (Until 2026-09-27 the raw form was matched with a bare `includes`, so
    // "3" matched "It took 30 days". Reported by Julien Gelee.)
    const whole = (n) => (/^\d/.test(n)
      ? new RegExp(`(?<![\\d.,])${escapeRegExp(n)}(?!\\d|,\\d|\\.\\d*[1-9])`)
      : new RegExp(`\\b${escapeRegExp(n)}\\b`));
    const wordEquiv = WORD_TO_NUMBER[normalizedNum];
    const wordMatch = wordEquiv ? new RegExp(`\\b${wordEquiv}\\b`).test(genNumClean) : false;
    return whole(normalizedNum).test(genNumClean) || whole(numericRaw).test(genLower) || wordMatch
      ? { correct: true, abstained: false, matchType: 'exact' }
      : { correct: false, abstained: false, matchType: 'miss' };
  }

  // Exact substring, or a long-answer prefix match.
  const exact = genLower.includes(answerLower) || (answerLower.length > 15 && genLower.includes(answerLower.slice(0, 30)));
  if (exact) return { correct: true, abstained: false, matchType: 'exact' };

  // Fuzzy: enough of the ground-truth content words appear in the answer.
  const answerWords = answerLower.split(/\s+/).filter((w) => w.length > 3);
  if (answerWords.length > 0) {
    const matched = answerWords.filter((w) => genLower.includes(w)).length;
    const threshold = answerWords.length <= 2 ? 1.0 : 0.5;
    if (matched >= Math.ceil(answerWords.length * threshold)) return { correct: true, abstained: false, matchType: 'fuzzy' };
  }
  return { correct: false, abstained: false, matchType: 'miss' };
}

// Which grader decides. The harness sends every answer to the judge, whatever
// the heuristic said, and the judge's verdict IS the verdict. A substring match
// cannot tell "bike first" from "car first, bike later", so it never overrules
// the judge. The harness skips the judge for an empty answer and for a ground
// truth that is itself "not mentioned"; the verdict is then null and the
// ledger scores it MISS. In the 2026-08 campaign that happened 0 times out of
// 144 answers. A human audit can still overturn a judge verdict: those
// overrides are listed in lexical-2026-08/human-audit.json, never here.
export function finalVerdict(groundTruth, generated, judgeVerdict) {
  if (!generated.trim() || abstentionExpected(groundTruth)) return null;
  return judgeVerdict;
}

// Three leniency levels. "strict" is the default branch below. The 2026-07
// campaign is scored "flexible"; the 2026-08 campaign publishes "strict" as its
// headline and "flexible" beside it. The judge receives the expected answer
// and the generated answer only, never the question.
export function judgePrompt(groundTruth, generated, leniency) {
  let leniencyInstruction = 'Assess if the Generated Answer contains or implies the Expected Ground Truth, explicitly or logically.\nIf the Generated Answer explicitly contains additional information but still correctly answers the Expected Ground Truth, answer YES.';
  if (leniency === 'flexible') {
    leniencyInstruction = 'Assess if the Generated Answer is generally on the right topic or provides a plausible partial answer related to the Expected Ground Truth.\nIf it expresses doubt but mentions relevant concepts, answer YES.';
  } else if (leniency === 'lenient') {
    leniencyInstruction = 'As long as the Generated Answer is not completely hallucinating a different topic, answer YES.\nAccept fuzzy memories, partial matches, and doubts as valid human-like responses.';
  }
  return `Instructions:
You are an impartial judge for an AI benchmark.
${leniencyInstruction}
EXCEPTION (overrides everything above): if the Generated Answer declines to answer, says it cannot determine the answer, or states that the information is unavailable — WITHOUT also giving the expected answer — reply NO.
Expected Ground Truth: "${groundTruth}"
Generated Answer: "${generated}"

Reply STRICTLY with YES or NO.`;
}

export function parseJudgeVerdict(reply) {
  const t = (reply ?? '').toUpperCase();
  const lastIndexOf = (re) => { let last = -1, m; while ((m = re.exec(t)) !== null) last = m.index; return last; };
  const lastYes = lastIndexOf(/\bYES\b/g);
  const lastNo = lastIndexOf(/\bNO\b/g);
  if (lastYes === -1 && lastNo === -1) return false;
  return lastYes >= lastNo;
}

// ── self-test ────────────────────────────────────────────────────────────────
// `node scoring.js --selftest` — shows the heuristic deciding real-shaped cases,
// so a reader can see it is strict, not tuned to inflate.
if (process.argv[1] && process.argv[1].endsWith('scoring.js') && process.argv.includes('--selftest')) {
  const cases = [
    ['Business Administration', 'you graduated with a degree in Business Administration.', 32, true],
    ['45 minutes each way', 'your daily commute is one hour each way.', 32, false],
    ['four', 'you have tried a total of 3 Korean restaurants.', 32, false],
    ['3', 'you need to pick up or return a total of 2 items of clothing.', 32, false],
    ['The Glass Menagerie', 'the play you attended was a production of "The Glass Menagerie".', 32, true],
    ['Tomatoes', 'the marigold seeds were started on March 3rd.', 32, false],
    // A number matches only as a whole number (reported 2026-09-27).
    ['3', 'It took 30 days', 32, false],
    ['3', 'It took 13 days', 32, false],
    ['3', 'you acquired 2 plants (Source 33).', 32, false],
    ['3', 'about 3.5 hours', 32, false],
    ['3', 'you walked 3,000 steps', 32, false],
    ['5', 'about 2.5 hours', 32, false],
    ['3', 'you have a total of 3 clothing items to pick up.', 32, true],
    ['$185', 'you have spent a total of $185.00 on bike expenses.', 32, true],
    ['$185', 'you have spent a total of $185.50 on bike expenses.', 32, false],
    ['1,200', 'about 1200 dollars', 32, true],
    ['1,200', 'about 11,200 dollars', 32, false],
  ];
  let ok = 0;
  for (const [gt, gen, src, want] of cases) {
    const r = scoreAnswer(gt, gen, src);
    const pass = r.correct === want;
    ok += pass ? 1 : 0;
    console.log(`${pass ? 'ok  ' : 'FAIL'} [${r.matchType.padEnd(9)}] want=${want} got=${r.correct}  gt="${gt}"  gen="${gen}"`);
  }
  // Which grader decides. gpt4_76048e76 (LongMemEval-M): the answer picks the
  // wrong item and names the right one later, so the heuristic says HIT. The
  // judge's verdict stands whatever the heuristic says.
  const bike = 'Based on the memory context, you took care of your car first in February.\n\nYou washed your car on February 3rd (Source 5). Your hybrid bike was taken in for repairs in "mid-February" (Source 2, 3, 34).';
  const precedence = [
    // [label, groundTruth, generated, judgeVerdict, wantHeuristic, wantFinal]
    ['heuristic HIT, judge NO', 'bike', bike, false, true, false],
    ['heuristic miss, judge YES', 'bike', 'You had your bicycle repaired first.', true, false, true],
    ['judge unreachable', 'bike', bike, null, true, null],
    ['abstention expected (judge skipped)', 'You did not mention this information.', 'I do not know.', true, true, null],
    ['empty answer (judge skipped)', 'bike', '', true, false, null],
  ];
  for (const [label, gt, gen, judge, wantHeur, wantFinal] of precedence) {
    const heur = scoreAnswer(gt, gen, 32).correct;
    const fin = finalVerdict(gt, gen, judge);
    const pass = heur === wantHeur && fin === wantFinal;
    ok += pass ? 1 : 0;
    console.log(`${pass ? 'ok  ' : 'FAIL'} [precedence] ${label}: heuristic=${heur} judge=${judge} -> final=${fin} (want ${wantFinal})`);
  }
  const total = cases.length + precedence.length;
  console.log(`\nself-test: ${ok}/${total} expected verdicts reproduced`);
  process.exit(ok === total ? 0 : 1);
}
