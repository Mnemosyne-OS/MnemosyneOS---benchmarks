#!/usr/bin/env node
// Speed of one GGUF model on one chip: load time, prompt processing, generation.
// Real llama.cpp through node-llama-cpp; nothing is estimated. Writes metrics.json and
// REPORT.md into $BENCHQ_JOB_DIR when run by benchq.
//
// usage: node gguf-speed.mjs --model <file.gguf> --chip cuda|vulkan-nvidia|vulkan-arc|cpu
//          [--prompt-tokens 512] [--gen 128] [--ctx 4096] [--name <label>]
//
// node-llama-cpp is not a dependency of benchq: it is taken from BENCHQ_LLAMA_MODULE, or
// from the Mnemosyne OS monorepo next to this folder.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const modelPath = opt('model');
const chip = opt('chip', 'cpu');
const promptTokens = Number(opt('prompt-tokens', 512));
const genTokens = Number(opt('gen', 128));
const ctxSize = Number(opt('ctx', 4096));
const repeat = Math.max(1, Number(opt('repeat', 3)));
const label = opt('name', modelPath ? path.basename(modelPath, '.gguf') : '');
const jobDir = process.env.BENCHQ_JOB_DIR || null;

function die(msg) {
  process.stderr.write(`gguf-speed: ${msg}\n`);
  if (jobDir) fs.writeFileSync(path.join(jobDir, 'REPORT.md'), `# ${label} · ${chip}: not measured\n\n${msg}\n`);
  process.exit(1);
}

if (!modelPath || !fs.existsSync(modelPath)) die(`model file not found: ${modelPath}`);

// Which Vulkan device is which, measured on this machine (2026-10-27 and 2026-11-12):
// 0 = the Intel Arc (unified memory), 1 = the RTX. Checked by name below, never assumed.
const CHIPS = {
  cuda: { gpu: 'cuda', expect: /nvidia/i },
  'vulkan-nvidia': { gpu: 'vulkan', vk: process.env.BENCHQ_VK_NVIDIA ?? '1', expect: /nvidia/i },
  'vulkan-arc': { gpu: 'vulkan', vk: process.env.BENCHQ_VK_ARC ?? '0', expect: /arc|intel/i },
  cpu: { gpu: false, expect: null },
};
const c = CHIPS[chip];
if (!c) die(`unknown chip "${chip}" (${Object.keys(CHIPS).join(', ')})`);
// llama.cpp reads GGML_VK_VISIBLE_DEVICES through the C runtime, whose copy of the
// environment is taken when the process starts: setting process.env here does not reach
// it on Windows (measured 2026-11-12: both GPUs stayed visible). So the script starts
// itself again with the variable in place.
if (c.vk != null && process.env.GGML_VK_VISIBLE_DEVICES !== c.vk) {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [process.argv[1], ...args], {
    stdio: 'inherit',
    env: { ...process.env, GGML_VK_VISIBLE_DEVICES: c.vk },
  });
  process.exit(r.status ?? 1);
}

function findLlamaModule() {
  if (process.env.BENCHQ_LLAMA_MODULE) return process.env.BENCHQ_LLAMA_MODULE;
  const pnpm = path.resolve(import.meta.dirname, '..', '..', '_MNEMOSYNE OS', 'node_modules', '.pnpm');
  if (fs.existsSync(pnpm)) {
    const dirs = fs.readdirSync(pnpm).filter((d) => d.startsWith('node-llama-cpp@')).sort().reverse();
    for (const d of dirs) {
      const p = path.join(pnpm, d, 'node_modules', 'node-llama-cpp', 'dist', 'index.js');
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function llamaVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(path.dirname(modPath), '..', 'package.json'), 'utf8')).version;
  } catch (err) {
    return `(version unreadable: ${err.message})`;
  }
}

const modPath = findLlamaModule();
if (!modPath) die('node-llama-cpp not found: set BENCHQ_LLAMA_MODULE to its dist/index.js');
const { getLlama, LlamaChatSession } = await import(pathToFileURL(modPath).href);

const t0 = performance.now();
const llama = await getLlama({ gpu: c.gpu, build: 'never' });
const devices = c.gpu ? await llama.getGpuDeviceNames() : [];
// Exactly the one card asked for: with two visible, llama.cpp may split the layers.
if (c.expect && !(devices.length === 1 && c.expect.test(devices[0]))) {
  die(`asked for ${chip}, llama.cpp sees ${JSON.stringify(devices)}: refusing to measure anything but that one chip`);
}
const vramBefore = c.gpu ? (await llama.getVramState()).used : 0;

// All layers on the card when they fit. A model larger than the card (LFM2.5-8B-A1B on the
// 6 GB RTX, 2026-11-12) is measured with as many layers as fit, and the report says so:
// that is what a user of this card gets.
let partialOffload = false;
const VRAM = /Not enough VRAM|too large for the available VRAM/;
// Both the layers and the context must fit: on 2026-11-12, 20 layers of LFM2.5-8B-A1B
// loaded, then a 4,096-token context did not. So each try loads and makes the context,
// and gives the layers back to the CPU until both fit. ("auto" refused as well: it
// sizes for the model's full training context.)
let model;
let context;
let loadMs = 0;
for (const layers of c.gpu ? ['max', 28, 24, 20, 16, 12, 8, 4] : [0]) {
  const tLoad = performance.now();
  try {
    model = await llama.loadModel({ modelPath, gpuLayers: layers });
    loadMs = performance.now() - tLoad;
    context = await model.createContext({ contextSize: ctxSize });
    break;
  } catch (err) {
    if (!c.gpu || !VRAM.test(String(err?.message))) throw err;
    process.stdout.write(`gguf-speed: ${layers} layers + context ${ctxSize} do not fit, trying fewer layers\n`);
    if (model) await model.dispose();
    model = undefined;
    partialOffload = true;
  }
}
if (!context) throw new Error('not even 4 layers and the context fit on this card');
const vramAfter = c.gpu ? (await llama.getVramState()).used : 0;

// A fixed, ordinary text, repeated to the prompt length: the same input for every model.
const base =
  'The archive kept every letter the family had written since the war: invoices, recipes, ' +
  'postcards from the coast, a list of debts paid in full, and notes about the weather. ';
let promptText = base;
let tokens = model.tokenize(promptText);
while (tokens.length < promptTokens) {
  promptText += base;
  tokens = model.tokenize(promptText);
}
tokens = tokens.slice(0, promptTokens);

// One sequence for the whole run, cleared between passes. Getting a new one after a
// dispose fails in node-llama-cpp 3.22.3: the old one is handed back asynchronously
// ("No sequences left").
const seq = context.getSequence();
// Generation goes through the model's own chat template, as the app uses it. A raw
// prompt made some models stop before their first token (measured 2026-11-12 on
// LFM2.5-350M and d1-3B). Every chunk counts, thoughts included: a reasoning model
// (LFM3) spends its first tokens thinking, and they cost the same time.
const ASK = 'Write a long story about a lighthouse keeper and the ships he saw.';
async function generate() {
  await seq.clearHistory();
  const session = new LlamaChatSession({ contextSequence: seq });
  const t = performance.now();
  let first = null;
  let last = null;
  let n = 0;
  await session.prompt(ASK, {
    maxTokens: genTokens,
    temperature: 0,
    onResponseChunk: (chunk) => {
      const now = performance.now();
      if (first === null) first = now;
      last = now;
      n += chunk.tokens.length;
    },
  });
  session.dispose({ disposeSequence: false });
  return { t, first: first ?? performance.now(), last: last ?? performance.now(), n };
}

// Warm-up, not measured. The first run of a model on a Vulkan card compiles its shaders:
// measured 2026-11-12 on the RTX, 5.9 tok/s cold against 112 tok/s on the next run.
const tWarm = performance.now();
await seq.clearHistory();
await seq.evaluateWithoutGeneratingNewTokens(tokens.slice(0, 64));
await generate();
const warmupMs = performance.now() - tWarm;

// Measured --repeat times (3 by default); the median is the number, min and max say how steady it was.
const promptRates = [];
const genRates = [];
const firstTokens = [];
let count = 0;
for (let r = 0; r < repeat; r++) {
  await seq.clearHistory();
  const tPrompt = performance.now();
  await seq.evaluateWithoutGeneratingNewTokens(tokens);
  promptRates.push(tokens.length / ((performance.now() - tPrompt) / 1000));

  const g = await generate();
  count = g.n;
  firstTokens.push(g.first - g.t);
  // Generation speed from the first token on, so the prompt itself does not count.
  if (g.n > 1) genRates.push((g.n - 1) / ((g.last - g.first) / 1000));
}
seq.dispose();
const median = (xs) => {
  if (!xs.length) return null;
  const v = [...xs].sort((x, y) => x - y);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);

const metrics = {
  model: label,
  chip,
  device: devices.join(' + ') || 'cpu',
  backend: llama.gpu || 'cpu',
  sizeGB: Math.round((fs.statSync(modelPath).size / 1024 ** 3) * 100) / 100,
  gpuLayers: model.gpuLayers,
  partialOffload,
  loadMs: Math.round(loadMs),
  warmupMs: Math.round(warmupMs),
  promptTokens: tokens.length,
  promptTokPerSec: r1(median(promptRates)),
  promptTokPerSecMin: r1(Math.min(...promptRates)),
  promptTokPerSecMax: r1(Math.max(...promptRates)),
  genTokens: count,
  firstTokenMs: Math.round(median(firstTokens)),
  genTokPerSec: r1(median(genRates)),
  genTokPerSecMin: genRates.length ? r1(Math.min(...genRates)) : null,
  genTokPerSecMax: genRates.length ? r1(Math.max(...genRates)) : null,
  repeat,
  vramMB: c.gpu ? Math.round((vramAfter - vramBefore) / 1048576) : 0,
  totalMs: Math.round(performance.now() - t0),
};

await context.dispose();
await model.dispose();
await llama.dispose();

const headline = `${label} · ${chip}: ${metrics.genTokPerSec} tok/s generation, ${metrics.promptTokPerSec} tok/s prompt, load ${(metrics.loadMs / 1000).toFixed(1)} s`;
console.log(headline);
console.log(JSON.stringify(metrics, null, 2));
if (jobDir) {
  fs.writeFileSync(path.join(jobDir, 'metrics.json'), JSON.stringify(metrics, null, 2) + '\n');
  fs.writeFileSync(
    path.join(jobDir, 'REPORT.md'),
    `# ${headline}\n\n` +
      `- device: ${metrics.device} (backend ${metrics.backend}, ${metrics.gpuLayers} layers on GPU${partialOffload ? ", PARTIAL: the model does not fit in this card, the rest runs on the CPU" : ""})\n` +
      `- file: ${metrics.sizeGB} GB, VRAM taken: ${metrics.vramMB} MB\n` +
      `- prompt: ${metrics.promptTokens} tokens in ${(metrics.promptTokens / metrics.promptTokPerSec).toFixed(2)} s\n` +
      `- generation: ${metrics.genTokens} tokens, first after ${metrics.firstTokenMs} ms, temperature 0\n` +
      `- median of ${repeat} runs; generation ${metrics.genTokPerSecMin} to ${metrics.genTokPerSecMax} tok/s, prompt ${metrics.promptTokPerSecMin} to ${metrics.promptTokPerSecMax} tok/s\n` +
      `- warm-up before measuring: ${metrics.warmupMs} ms (64 prompt tokens, 8 generated)\n` +
      `- measured with node-llama-cpp ${llamaVersion()}, context ${ctxSize}\n`
  );
}
