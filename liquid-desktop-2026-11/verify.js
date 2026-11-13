#!/usr/bin/env node
// Recomputes data.json (the numbers on index.html) from the raw job files in jobs/.
// Rule, same as the page: for each model and chip, the latest successful run wins.
// Exit 0 when every published figure matches the logs, 1 otherwise.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const jobsDir = path.join(here, 'jobs');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const out = { speed: new Map(), prompt4k: new Map(), ov: new Map(), router: new Map(), longdoc: new Map() };
const status = {};
for (const id of fs.readdirSync(jobsDir).sort()) {
  const job = read(path.join(jobsDir, id, 'job.json'));
  const key0 = `${job.series} ${job.status}`;
  status[key0] = (status[key0] || 0) + 1;
  const mp = path.join(jobsDir, id, 'metrics.json');
  if (job.status !== 'done' || !fs.existsSync(mp)) continue;
  const m = read(mp);
  const t = job.tags || {};
  const s = job.series;
  if (s === 'gguf-speed-v2' || s === 'gguf-prompt-4k') {
    if (!((m.genTokPerSec || 0) > 0)) continue;
    const row = {
      model: t.model, chip: t.chip, repo: t.repo, quant: t.quant,
      sizeGB: m.sizeGB, gpuLayers: m.gpuLayers, loadMs: m.loadMs, vramMB: m.vramMB,
      gen: m.genTokPerSec, genMin: m.genTokPerSecMin, genMax: m.genTokPerSecMax,
      prompt: m.promptTokPerSec, promptMin: m.promptTokPerSecMin, promptMax: m.promptTokPerSecMax,
      promptTokens: m.promptTokens, firstTokenMs: m.firstTokenMs, job: id,
    };
    (s === 'gguf-speed-v2' ? out.speed : out.prompt4k).set(`${t.model}|${t.chip}`, row);
  } else if (s === 'ov-load') {
    out.ov.set(`${t.model}|${t.chip}`, { model: t.model, chip: t.chip, device: m.deviceName, gen: m.genTokPerSec, cores: m.procCores, rssMB: m.rssMB, job: id });
  } else if (s === 'ov-router') {
    out.router.set(`${t.model}|${t.chip}`, { model: t.model, chip: t.chip, score: m.score, of: m.of, medianMs: m.medianMs, cores: m.procCores, perLang: m.perLang, job: id });
  } else if (s === 'ov-longdoc') {
    out.longdoc.set(m.device, { device: m.device, promptTokens: m.promptTokens, firstTokenMs: m.firstTokenMs, gen: m.genTokPerSec, cores: m.procCores, job: id });
  }
}

// Undefined fields are dropped, as JSON drops them; null stays null.
const norm = (v) => JSON.parse(JSON.stringify(v));
const published = read(path.join(here, 'data.json'));
let bad = 0;
for (const k of Object.keys(out)) {
  const mine = norm([...out[k].values()]);
  const theirs = published[k];
  if (JSON.stringify(mine) !== JSON.stringify(theirs)) {
    bad++;
    console.log(`MISMATCH ${k}: recomputed ${mine.length} rows, published ${theirs.length}`);
    for (let i = 0; i < Math.max(mine.length, theirs.length); i++) {
      if (JSON.stringify(mine[i]) !== JSON.stringify(theirs[i])) {
        console.log('  recomputed', JSON.stringify(mine[i]));
        console.log('  published ', JSON.stringify(theirs[i]));
        break;
      }
    }
  } else {
    console.log(`ok ${k.padEnd(9)} ${mine.length} rows`);
  }
}
// The page carries its own copy of the data: it must be the same as data.json.
const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
const inline = html.match(/const DATA = (\{.*?\});\s*\n/s);
if (!inline) {
  bad++;
  console.log('MISMATCH index.html: no inline DATA found');
} else if (JSON.stringify(JSON.parse(inline[1])) !== JSON.stringify(published)) {
  bad++;
  console.log('MISMATCH index.html: its inline DATA differs from data.json');
} else {
  console.log('ok index.html carries the same data as data.json');
}

console.log('\njobs by series and status (failed and cancelled runs are kept):');
for (const [k, n] of Object.entries(status).sort()) console.log(`  ${String(n).padStart(3)}  ${k}`);
process.exit(bad ? 1 : 0);
