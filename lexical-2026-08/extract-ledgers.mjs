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
 * Outputs (../verification-kit/results/), one pair per judge leniency:
 *   lexical-baseline-strict-48q.jsonl    lexical-baseline-flexible-48q.jsonl
 *   lexical-fusion-strict-48q.jsonl      lexical-fusion-flexible-48q.jsonl
 *
 * The two leniencies come from the SAME runs — every raw row carries both a
 * `judge.strict` and a `judge.flexible` verdict, so the flexible pair is the
 * identical answers re-read by July's grader. Publishing both is the point: a
 * score means nothing without the judge that produced it, and the flexible
 * number was quotable long before it was recomputable.
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
const r2M = byId(r2);

if (base.length !== 48 || r1.length !== 48 || r2.length !== 48) {
  throw new Error(`expected 48 rows per run, got ${base.length}/${r1.length}/${r2.length}`);
}

const RETRIEVAL_BASE = 'topK=32, +3 reserved dream-ledger slots (nSrc=35), vector ranking only';
const RETRIEVAL_FUSED =
  'topK=32, +3 reserved dream-ledger slots (nSrc=35), vector ranking fused with BM25 (k1=1.5, b=0.75) by RRF (k=60) — literature defaults, untuned';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ── Ledger builders, parameterised by judge leniency ─────────────────────────
// `strict` and `flexible` are two readings of the same answers, so both ledgers
// are built by one code path. Nothing below hard-codes a verdict count: every
// expected_* field is derived from the rows the ledger ships with.

const buildBaseline = (lenity) => {
  const hits = base.filter((r) => r.judge[lenity] === true).length;
  const meta = {
    _meta: {
      run: `LongMemEval-M full-haystack, full engine (spine-sort + dream ledgers), vector-only retrieval — ${lenity.toUpperCase()} judge`,
      date: '2026-08-15/17',
      dataset: 'LongMemEval-M',
      variant: 'full-haystack (~480 distractor sessions per question)',
      answer_model: 'gemini-2.5-pro (Vertex)',
      judge_model: 'gemini-2.5-flash',
      judge_leniency: lenity,
      retrieval: RETRIEVAL_BASE,
      embeddings: 'e5-base (768D)',
      expected_hits: hits,
      expected_total: 48,
      expected_accuracy_pct: +((100 * hits) / 48).toFixed(1),
      note: `${cap(lenity)} verdicts extracted from lexical-2026-08/runs/duel-full.rejudged.json by lexical-2026-08/extract-ledgers.mjs. The same raw file carries the other leniency, published as its own ledger. This 48-question sample runs ~13 points easier than its parent set (see the campaign SUMMARY); the paired ledger to read it against is lexical-fusion-${lenity}-48q.jsonl. generated/expected are truncated excerpts; the full strings are in the committed run file.`,
    },
  };
  const rows = base.map((r) => ({
    question_id: r.id,
    category: r.cat,
    correct: r.judge[lenity] === true,
    match_type: r.judge.heuristic ? r.judge.matchType : 'llm_judge',
    generated: trunc(r.generated),
    expected: trunc(r.gold),
    runs: [
      {
        log: 'lexical-2026-08/runs/duel-full.rejudged.json',
        verdict: r.judge[lenity] ? 'HIT' : 'MISS',
        answer: trunc(r.generated),
      },
    ],
  }));
  return { meta, rows, hits };
};

const buildFusion = (lenity, baselineRows) => {
  const baseCorrect = new Map(baselineRows.map((r) => [r.question_id, r.correct]));
  let disagreements = 0;
  const rows = r1.map((r) => {
    const twin = r2M.get(r.id);
    if (!twin) throw new Error(`run 2 is missing question ${r.id}`);
    const stable = r.judge[lenity] === twin.judge[lenity];
    if (!stable) disagreements++;
    return {
      question_id: r.id,
      category: r.cat,
      // Replay rule: a HIT counts only if BOTH independent runs judged it a HIT.
      // Applied identically to both leniencies — a rule that only ever tightened
      // the number we like least would not be a rule.
      correct: r.judge[lenity] === true && twin.judge[lenity] === true,
      match_type: r.judge.heuristic ? r.judge.matchType : 'llm_judge',
      replay_stable: stable,
      baseline_correct: baseCorrect.has(r.id) ? baseCorrect.get(r.id) : null,
      generated: trunc(r.generated),
      expected: trunc(r.gold),
      ...(stable
        ? {}
        : {
            discard_reason: `${lenity} verdict differed between the two runs; scored by the conjunction, both verdicts kept visible in the committed run files`,
          }),
      runs: [
        {
          log: 'lexical-2026-08/runs/duel-full-lexfusion.json',
          verdict: r.judge[lenity] ? 'HIT' : 'MISS',
          answer: trunc(r.generated),
        },
        {
          log: 'lexical-2026-08/runs/duel-full-lexfusion-r2.json',
          verdict: twin.judge[lenity] ? 'HIT' : 'MISS',
          answer: trunc(twin.generated),
        },
      ],
    };
  });
  const hits = rows.filter((r) => r.correct).length;
  const regressions = rows.filter((r) => !r.correct && r.baseline_correct === true).length;
  const gains = rows.filter((r) => r.correct && r.baseline_correct === false).length;
  const meta = {
    _meta: {
      run: `LongMemEval-M full-haystack, full engine + LEXICAL CHANNEL (BM25 over a persistent inverted index, fused by Reciprocal Rank Fusion) — ${lenity.toUpperCase()} judge, two independent runs`,
      date: '2026-08-17',
      dataset: 'LongMemEval-M',
      variant: 'full-haystack (~480 distractor sessions per question)',
      answer_model: 'gemini-2.5-pro (Vertex)',
      judge_model: 'gemini-2.5-flash',
      judge_leniency: lenity,
      retrieval: RETRIEVAL_FUSED,
      embeddings: 'e5-base (768D)',
      expected_hits: hits,
      expected_total: 48,
      expected_accuracy_pct: +((100 * hits) / 48).toFixed(1),
      replay_rule:
        'A HIT counts only if it reproduces on a second independent run of the same configuration. Both runs are named per row in `runs` and committed in lexical-2026-08/runs/.',
      composition_note: `Paired against lexical-baseline-${lenity}-48q.jsonl: +${gains} gained, −${regressions} regressed, per the baseline_correct field on every row. This sample was used during development; the transfer check on 48 UNSEEN questions is the deterministic-retrieval holdout in lexical-2026-08/runs/recall-hold-{off,on}.json, recomputed by verify.js.`,
      note: `${cap(lenity)} verdicts extracted mechanically by lexical-2026-08/extract-ledgers.mjs; the same run files carry the other leniency, published as its own ledger. generated/expected are truncated excerpts; full strings are in the committed run files.`,
    },
  };
  return { meta, rows, hits, gains, regressions, disagreements };
};

const writeLedger = (name, meta, rows) => {
  writeFileSync(join(OUT, name), [JSON.stringify(meta), ...rows.map((r) => JSON.stringify(r))].join('\n') + '\n');
  console.log(`wrote ${name}: ${rows.length} rows`);
};

for (const lenity of ['strict', 'flexible']) {
  const b = buildBaseline(lenity);
  const f = buildFusion(lenity, b.rows);
  writeLedger(`lexical-baseline-${lenity}-48q.jsonl`, b.meta, b.rows);
  writeLedger(`lexical-fusion-${lenity}-48q.jsonl`, f.meta, f.rows);
  console.log(
    `  ${lenity}: baseline ${b.hits}/48 → fusion ${f.hits}/48 (both-runs rule) · paired +${f.gains}/−${f.regressions} · run disagreements: ${f.disagreements}`,
  );
}
