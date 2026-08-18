#!/usr/bin/env node
/**
 * extract-ledgers.mjs — mechanically derives the verification-kit ledgers for
 * the lexical-channel campaign from the raw run files in ./runs/.
 *
 * Per AGENTS.md, no ledger row is ever written by hand: this script IS the
 * extraction, committed so a reader can re-run it and diff the output against
 * the committed ledgers. It needs nothing but Node.
 *
 *   node lexical-2026-08/extract-ledgers.mjs
 *
 * Inputs (committed in ./runs/):
 *   duel-full.rejudged.json      vector-only full engine, strict re-judge
 *   duel-full-lexfusion.json     + lexical channel, run 1
 *   duel-full-lexfusion-r2.json  + lexical channel, run 2 (independent replay)
 *
 * Outputs (../verification-kit/results/):
 *   lexical-baseline-strict-48q.jsonl
 *   lexical-fusion-strict-48q.jsonl
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = join(HERE, 'runs');
const OUT = join(HERE, '..', 'verification-kit', 'results');

const load = (f) => JSON.parse(readFileSync(join(RUNS, f), 'utf8')).results;
const trunc = (s, n = 220) => (typeof s === 'string' && s.length > n ? s.slice(0, n) + '…' : s);

const base = load('duel-full.rejudged.json');
const r1 = load('duel-full-lexfusion.json');
const r2 = load('duel-full-lexfusion-r2.json');

const byId = (rows) => new Map(rows.map((r) => [r.id, r]));
const baseM = byId(base), r2M = byId(r2);

if (base.length !== 48 || r1.length !== 48 || r2.length !== 48) {
  throw new Error(`expected 48 rows per run, got ${base.length}/${r1.length}/${r2.length}`);
}

// ── Ledger 1: baseline (vector-only), strict ─────────────────────────────────
const baseHits = base.filter((r) => r.judge.strict === true).length;
const baseMeta = {
  _meta: {
    run: 'LongMemEval-M full-haystack, full engine (spine-sort + dream ledgers), vector-only retrieval — STRICT re-judge',
    date: '2026-08-15/17',
    dataset: 'LongMemEval-M',
    variant: 'full-haystack (~480 distractor sessions per question)',
    answer_model: 'gemini-2.5-pro (Vertex)',
    judge_model: 'gemini-2.5-flash',
    judge_leniency: 'strict',
    retrieval: 'topK=32, +3 reserved dream-ledger slots (nSrc=35), vector ranking only',
    embeddings: 'e5-base (768D)',
    expected_hits: baseHits,
    expected_total: 48,
    expected_accuracy_pct: +(100 * baseHits / 48).toFixed(1),
    note: 'Strict verdicts extracted from lexical-2026-08/runs/duel-full.rejudged.json by lexical-2026-08/extract-ledgers.mjs. The raw file also carries the flexible verdicts. This 48-question sample runs ~13 points easier than its parent set (see the campaign SUMMARY); the paired ledger to read it against is lexical-fusion-strict-48q.jsonl. generated/expected are truncated excerpts; the full strings are in the committed run file.',
  },
};
const baseRows = base.map((r) => ({
  question_id: r.id,
  category: r.cat,
  correct: r.judge.strict === true,
  match_type: r.judge.heuristic ? r.judge.matchType : 'llm_judge',
  generated: trunc(r.generated),
  expected: trunc(r.gold),
  runs: [{ log: 'lexical-2026-08/runs/duel-full.rejudged.json', verdict: r.judge.strict ? 'HIT' : 'MISS', answer: trunc(r.generated) }],
}));

// ── Ledger 2: + lexical channel, strict, two independent runs ────────────────
let disagreements = 0;
const fusionRows = r1.map((r) => {
  const twin = r2M.get(r.id);
  if (!twin) throw new Error(`run 2 is missing question ${r.id}`);
  const stable = r.judge.strict === twin.judge.strict;
  if (!stable) disagreements++;
  const b = baseM.get(r.id);
  return {
    question_id: r.id,
    category: r.cat,
    // Replay rule: a HIT counts only if BOTH independent runs judged it strict-HIT.
    correct: r.judge.strict === true && twin.judge.strict === true,
    match_type: r.judge.heuristic ? r.judge.matchType : 'llm_judge',
    replay_stable: stable,
    baseline_correct: b ? b.judge.strict === true : null,
    generated: trunc(r.generated),
    expected: trunc(r.gold),
    ...(stable ? {} : { discard_reason: 'strict verdict differed between the two runs; scored by the conjunction, both verdicts kept visible in the committed run files' }),
    runs: [
      { log: 'lexical-2026-08/runs/duel-full-lexfusion.json', verdict: r.judge.strict ? 'HIT' : 'MISS', answer: trunc(r.generated) },
      { log: 'lexical-2026-08/runs/duel-full-lexfusion-r2.json', verdict: twin.judge.strict ? 'HIT' : 'MISS', answer: trunc(twin.generated) },
    ],
  };
});
const fusionHits = fusionRows.filter((r) => r.correct).length;
const regressions = fusionRows.filter((r) => !r.correct && r.baseline_correct === true).length;
const gains = fusionRows.filter((r) => r.correct && r.baseline_correct === false).length;

const fusionMeta = {
  _meta: {
    run: 'LongMemEval-M full-haystack, full engine + LEXICAL CHANNEL (BM25 over a persistent inverted index, fused by Reciprocal Rank Fusion) — STRICT judge, two independent runs',
    date: '2026-08-17',
    dataset: 'LongMemEval-M',
    variant: 'full-haystack (~480 distractor sessions per question)',
    answer_model: 'gemini-2.5-pro (Vertex)',
    judge_model: 'gemini-2.5-flash',
    judge_leniency: 'strict',
    retrieval: 'topK=32, +3 reserved dream-ledger slots (nSrc=35), vector ranking fused with BM25 (k1=1.5, b=0.75) by RRF (k=60) — literature defaults, untuned',
    embeddings: 'e5-base (768D)',
    expected_hits: fusionHits,
    expected_total: 48,
    expected_accuracy_pct: +(100 * fusionHits / 48).toFixed(1),
    replay_rule: 'A HIT counts only if it reproduces on a second independent run of the same configuration. Both runs are named per row in `runs` and committed in lexical-2026-08/runs/.',
    composition_note: `Paired against lexical-baseline-strict-48q.jsonl: +${gains} gained, −${regressions} regressed, per the baseline_correct field on every row. This sample was used during development; the transfer check on 48 UNSEEN questions is the deterministic-retrieval holdout in lexical-2026-08/runs/recall-hold-{off,on}.json, recomputed by verify.js.`,
    note: 'Strict verdicts extracted mechanically by lexical-2026-08/extract-ledgers.mjs; the raw run files also carry the flexible verdicts. generated/expected are truncated excerpts; full strings are in the committed run files.',
  },
};

const writeLedger = (name, meta, rows) => {
  const path = join(OUT, name);
  writeFileSync(path, [JSON.stringify(meta), ...rows.map((r) => JSON.stringify(r))].join('\n') + '\n');
  console.log(`wrote ${name}: ${rows.length} rows`);
};

writeLedger('lexical-baseline-strict-48q.jsonl', baseMeta, baseRows);
writeLedger('lexical-fusion-strict-48q.jsonl', fusionMeta, fusionRows);

console.log(`baseline strict hits: ${baseHits}/48`);
console.log(`fusion strict hits (both-runs rule): ${fusionHits}/48 — run disagreements: ${disagreements}`);
console.log(`paired vs baseline: +${gains} / −${regressions}`);
