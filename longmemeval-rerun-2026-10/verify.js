#!/usr/bin/env node
/**
 * Recompute every number of the LongMemEval-M rerun from the raw files in this
 * folder. No network, no dependencies, no memory engine.
 *
 *   node verify.js
 *
 * It exits non-zero on the first mismatch. What it checks:
 *   1. the salt published after the run is the one whose SHA-256 the frozen
 *      protocol published before it;
 *   2. every entry of id-map.json follows from that salt, and no dataset
 *      session id appears in any answer or verdict file;
 *   3. every run used the same engine build, reader and retrieval settings,
 *      answered all 48 questions of its set, and had no infrastructure failure;
 *   4. every verdict follows from the judge's raw reply;
 *   5. the scores, both passes required, before and after the human audit.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const read = (f) => JSON.parse(fs.readFileSync(path.join(HERE, f), 'utf8'));
const pct = (n, d) => ((n / d) * 100).toFixed(1);

let failures = 0;
const fail = (msg) => { failures++; console.log(`   [FAIL] ${msg}`); };
const pass = (msg) => console.log(`   [ok]   ${msg}`);
const check = (ok, good, bad) => (ok ? pass(good) : fail(bad));

// Fixed by the frozen protocol (PROTOCOL.md sections 4, 5 and 6).
const PROTOCOL = {
  saltSha256: '8a5309dc094b2cd0c5519f1596c7368ff3358b85a3c06c956cff01702e43861e',
  coreDistSha256: 'ca95266d990bd39cdc28834a61a4b03370dbe50e01cdee08374593dff4b30a3f',
  coreEngineVersion: '1.6.0',
  reader: 'vertex:gemini-3.8-flash',
  topK: 32,
  maxSourceChars: 3000,
  dreamReserve: 3,
  officialJudge: 'gpt-4o-2024-08-06',
  strictJudge: 'gemini-3.5-flash',
};

// What we publish. Both passes must be a HIT for a question to count.
const PUBLISHED = {
  holdout: {
    fused: { official: { before: 37, after: 37 }, strict: { before: 38, after: 38 } },
    vector: { official: { before: 38, after: 38 }, strict: { before: 37, after: 37 } },
  },
  dev: {
    fused: { official: { before: 39, after: 39 }, strict: { before: 42, after: 41 } },
    vector: { official: { before: 39, after: 38 }, strict: { before: 39, after: 38 } },
  },
};

const SETS = ['dev', 'holdout'];
const ARMS = ['fused', 'vector'];
const PASSES = [1, 2];
const JUDGES = ['official', 'strict'];
const QUESTIONS = read('questions.json');
const AUDIT = read('human-audit.json').overrides;

console.log('\nLongMemEval-M rerun 2026-10: recomputing every number from the raw files\n');

// ── 1. The salt ──────────────────────────────────────────────────────────────
console.log('Salt and session ids');
const salt = fs.readFileSync(path.join(HERE, 'salt.txt'), 'utf8');
const saltSha = crypto.createHash('sha256').update(salt).digest('hex');
check(saltSha === PROTOCOL.saltSha256,
  `SHA-256 of salt.txt is ${saltSha.slice(0, 16)}…, the value the frozen protocol published`,
  `SHA-256 of salt.txt is ${saltSha}, the protocol published ${PROTOCOL.saltSha256}`);

// ── 2. The id map ────────────────────────────────────────────────────────────
const idMap = read('id-map.json');
const anon = (id) => `s_${crypto.createHash('sha256').update(`${salt}${id}`).digest('hex').slice(0, 12)}`;
const entries = Object.entries(idMap);
const wrong = entries.filter(([orig, a]) => anon(orig) !== a);
check(wrong.length === 0,
  `${entries.length} session ids in id-map.json, every one recomputed from the salt`,
  `${wrong.length} id-map entries do not follow from the salt (first: ${wrong[0]?.[0]})`);
const known = new Set(Object.values(idMap));
const DATASET_ID = /(answer_[0-9a-f]{8}\w*|sharegpt_[A-Za-z0-9]{5,}_\d+|ultrachat_\d+|\b[0-9a-f]{8}_\d+\b)/g;
let leaks = 0, quoted = 0, unknown = 0;
for (const f of fs.readdirSync(path.join(HERE, 'runs'))) {
  const text = fs.readFileSync(path.join(HERE, 'runs', f), 'utf8');
  leaks += (text.match(DATASET_ID) || []).length;
  for (const id of text.match(/\bs_[0-9a-f]{12}\b/g) || []) { quoted++; if (!known.has(id)) unknown++; }
}
check(leaks === 0, 'no dataset session id in any answer or verdict file', `${leaks} dataset session id(s) found in the run files`);
check(unknown === 0,
  `${quoted} anonymized ids quoted in the run files, all present in id-map.json`,
  `${unknown} of ${quoted} anonymized ids quoted in the run files are not in id-map.json`);

// ── 3 and 4. Each run file ───────────────────────────────────────────────────
console.log('\nRun files');
const runs = {};
const builds = new Set();
for (const set of SETS) {
  const ids = QUESTIONS[set].map((q) => q.question_id).sort();
  for (const arm of ARMS) {
    for (const p of PASSES) {
      const a = read(`runs/answers-${set}-${arm}-p${p}.json`);
      const j = read(`runs/judged-${set}-${arm}-p${p}.json`);
      const tag = `${set} ${arm} pass ${p}`;
      const rowIds = Object.keys(a.rows).sort();
      const problems = [];
      if (JSON.stringify(rowIds) !== JSON.stringify(ids)) problems.push('question ids differ from questions.json');
      if (JSON.stringify(Object.keys(j.rows).sort()) !== JSON.stringify(ids)) problems.push('verdict ids differ from questions.json');
      if (a.build.coreDistSha256 !== PROTOCOL.coreDistSha256) problems.push(`engine dist ${a.build.coreDistSha256.slice(0, 12)}`);
      if (a.build.coreEngineVersion !== PROTOCOL.coreEngineVersion) problems.push(`engine ${a.build.coreEngineVersion}`);
      if (a.build.coreSrcClean !== true) problems.push('engine source not clean');
      if (a.reader !== PROTOCOL.reader) problems.push(`reader ${a.reader}`);
      if (a.retrieval.topK !== PROTOCOL.topK || a.retrieval.maxSourceChars !== PROTOCOL.maxSourceChars) problems.push('retrieval settings');
      if (a.dreamReserve !== PROTOCOL.dreamReserve) problems.push(`dream reserve ${a.dreamReserve}`);
      if (a.dateToReader !== true) problems.push('question text not bare for retrieval');
      if (a.gates?.gates?.lexicalFusion !== (arm === 'fused' ? '1' : '0')) problems.push('lexical channel does not match the arm');
      if (j.officialJudge !== PROTOCOL.officialJudge || j.strictJudge !== PROTOCOL.strictJudge) problems.push('judge models');
      const infra = Object.values(a.rows).filter((r) => r.infra).length;
      if (infra) problems.push(`${infra} infrastructure failure(s)`);
      // A verdict must follow from the raw reply: the official judge counts a
      // reply containing "yes", as LongMemEval's evaluate_qa.py does; the
      // strict judge answers YES or NO.
      for (const [id, r] of Object.entries(j.rows)) {
        if (r.official.verdict !== /yes/i.test(r.official.reply)) problems.push(`${id}: official verdict does not follow from "${r.official.reply}"`);
        if (r.strict.verdict !== /^\s*YES\b/i.test(r.strict.reply)) problems.push(`${id}: strict verdict does not follow from "${r.strict.reply}"`);
      }
      builds.add(a.build.monorepoCommit.slice(0, 9));
      check(problems.length === 0,
        `${tag}: 48 answers, 0 infrastructure failures, protocol build and settings, verdicts follow from the replies`,
        `${tag}: ${problems.slice(0, 4).join('; ')}`);
      runs[`${set}/${arm}/${p}`] = { a, j };
    }
  }
}
console.log(`   [note] run logs name the monorepo commits ${[...builds].join(', ')}; see PROTOCOL.md section 10`);

// ── 5. Scores ────────────────────────────────────────────────────────────────
const overturned = (set, arm, p, id, judge) =>
  AUDIT.some((o) => o.set === set && o.question_id === id && o.judges.includes(judge) && o.runs.includes(`judged-${set}-${arm}-p${p}.json`));
const verdict = (set, arm, p, id, judge, audited) => {
  if (audited && overturned(set, arm, p, id, judge)) return AUDIT.find((o) => o.set === set && o.question_id === id && o.judges.includes(judge) && o.runs.includes(`judged-${set}-${arm}-p${p}.json`)).verdict === 'HIT';
  return runs[`${set}/${arm}/${p}`].j.rows[id][judge].verdict === true;
};
const hits = (set, arm, judge, audited) =>
  QUESTIONS[set].map((q) => q.question_id).filter((id) => PASSES.every((p) => verdict(set, arm, p, id, judge, audited)));

/** Exact two-sided sign test on the discordant questions. */
function signTest(plus, minus) {
  const n = plus + minus;
  if (n === 0) return 1;
  const k = Math.min(plus, minus);
  let tail = 0;
  for (let i = 0; i <= k; i++) {
    let c = 1;
    for (let t = 0; t < i; t++) c = (c * (n - t)) / (t + 1);
    tail += c;
  }
  return Math.min(1, (2 * tail) / 2 ** n);
}

for (const set of ['holdout', 'dev']) {
  console.log(`\nScores, ${set} set (48 questions, a HIT on both passes)`);
  for (const judge of JUDGES) {
    for (const arm of ARMS) {
      const before = hits(set, arm, judge, false).length;
      const after = hits(set, arm, judge, true).length;
      const want = PUBLISHED[set][arm][judge];
      check(before === want.before && after === want.after,
        `${judge.padEnd(8)} ${arm.padEnd(6)} ${after}/48 = ${pct(after, 48)}%  (before the human audit: ${before}/48)`,
        `${judge} ${arm}: ${before} before / ${after} after the audit, we publish ${want.before} / ${want.after}`);
    }
    const f = new Set(hits(set, 'fused', judge, true));
    const v = new Set(hits(set, 'vector', judge, true));
    const plus = [...f].filter((id) => !v.has(id)).length;
    const minus = [...v].filter((id) => !f.has(id)).length;
    pass(`${judge.padEnd(8)} fused vs vector: +${plus} / -${minus}, exact sign test p = ${signTest(plus, minus).toFixed(3)}`);
  }
  const split = [];
  for (const arm of ARMS) for (const judge of JUDGES) {
    for (const q of QUESTIONS[set]) {
      const [a, b] = PASSES.map((p) => verdict(set, arm, p, q.question_id, judge, true));
      if (a !== b) split.push(`${arm}/${judge}:${q.question_id}`);
    }
  }
  console.log(`   [note] passes disagree on ${split.length} (arm/judge/question): ${split.join(' ') || 'none'}`);
}

console.log(`\nHuman audit: ${AUDIT.length} overturned verdict(s), all listed in human-audit.json`);
for (const o of AUDIT) console.log(`   ${o.set} ${o.question_id} (${o.judges.join('+')}) -> ${o.verdict}: ${o.runs.length} run(s)`);

console.log('');
if (failures) {
  console.log(`FAILED: ${failures} mismatch(es). A published number does not follow from its files.\n`);
  process.exit(1);
}
console.log('Every number of the rerun recomputes from the files in this folder.\n');
