"""A small LLM as the orb's intent router, on one OpenVINO device: score on the 140-sentence
set (20 sentences x 7 languages) of the d1 bench of 2026-11-07, latency, CPU taken.

Not like for like with d1: d1 reads a probability for each intent in one pass and the app
acts above a 0.8 threshold; a generating LLM writes one label and gives no confidence.
The score says whether the model sorts the sentences, not whether it can replace d1.

usage: python -I ov-router.py --model <dir> --device NPU|CPU|GPU.0 --set <phrases-7lang.json>
         [--name <label>] [--no-think] [--baseline 10]
"""
import argparse
import json
import os
import re
import statistics
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8")

import openvino as ov  # noqa: E402
import openvino_genai as ovg  # noqa: E402
from benchload import Sampler, baseline, fail, write_report  # noqa: E402

# The same intents and descriptions as the d1 bench (bench.py, CRITERIA).
CRITERIA = {
    "app": "Open, show or drive an app inside Mnemosyne OS: Atlas, Molecule, the music player, Loom, a 3D heart, play music",
    "window": "Change a window already on screen: full screen, close it, move it",
    "weather": "Weather or forecast for a place or a day",
    "task": "Add or change a to-do item or a task category",
    "agenda": "Read or add appointments in the calendar",
    "expense": "Record money spent or a budget entry",
    "remember": "Ask the assistant to keep something in memory",
    "recall": "A question answered from the person's own notes or project history",
    "chat": "Conversation, a remark, a reaction or a general question to the assistant",
}

p = argparse.ArgumentParser()
p.add_argument("--model", required=True)
p.add_argument("--device", required=True)
p.add_argument("--set", required=True)
p.add_argument("--name", default=None)
p.add_argument("--no-think", action="store_true", help="append /no_think (Qwen3)")
p.add_argument("--baseline", type=float, default=10.0)
a = p.parse_args()
name = a.name or os.path.basename(a.model.rstrip("\\/"))
label = f"router {name} · {a.device}"

core = ov.Core()
if a.device not in core.available_devices:
    fail(label, f"device {a.device} not seen by OpenVINO (it sees {core.available_devices})")

with open(a.set, encoding="utf-8") as f:
    data = json.load(f)
labels = data["labels"]
langs = [k for k in data if not k.startswith("_") and k != "labels"]

menu = "\n".join(f"- {k}: {v}" for k, v in CRITERIA.items())


def prompt(sentence):
    return (
        "A person spoke this sentence to the voice assistant of Mnemosyne OS:\n"
        f"\"{sentence}\"\n\n"
        f"What does the person want? Pick exactly one label:\n{menu}\n\n"
        "Answer with the label only, one word." + (" /no_think" if a.no_think else "")
    )


def parse(text):
    text = re.sub(r"<think>.*?(</think>|$)", " ", text, flags=re.S).lower()
    hits = [(m.start(), k) for k in CRITERIA for m in [re.search(rf"\b{k}\b", text)] if m]
    return min(hits)[1] if hits else None


base = baseline(a.baseline)
cfg = {"CACHE_DIR": os.path.join(a.model, ".ov-cache")}
if a.device == "NPU":
    cfg.update({"MAX_PROMPT_LEN": 512, "MIN_RESPONSE_LEN": 32})
t = time.perf_counter()
try:
    pipe = ovg.LLMPipeline(a.model, a.device, **cfg)
except Exception as err:
    fail(label, f"could not load on {a.device}: {err}")
load_ms = (time.perf_counter() - t) * 1000

g = ovg.GenerationConfig()
g.max_new_tokens = 24
g.do_sample = False
pipe.generate(prompt("Hello"), g)  # warm-up, not measured

s = Sampler()
s.start()
per_lang, misses, lat, unparsed, answers = {}, [], [], 0, []
for lang in langs:
    ok = 0
    for i, (text, want) in enumerate(zip(data[lang], labels)):
        t = time.perf_counter()
        out = str(pipe.generate(prompt(text), g))
        lat.append((time.perf_counter() - t) * 1000)
        got = parse(out)
        unparsed += got is None
        ok += got == want
        answers.append({"lang": lang, "i": i + 1, "want": want, "got": got, "raw": out.strip()[:80]})
        if got != want:
            misses.append(f"{lang} #{i + 1} {want} -> {got}")
    per_lang[lang] = ok
run = s.stop()

total = sum(per_lang.values())
n = len(labels) * len(langs)
metrics = {
    "model": name,
    "device": a.device,
    "deviceName": core.get_property(a.device, "FULL_DEVICE_NAME"),
    "engine": f"openvino-genai {ovg.__version__}",
    "score": total,
    "of": n,
    "perLang": per_lang,
    "unparsed": unparsed,
    "medianMs": round(statistics.median(lat)),
    "p90Ms": round(sorted(lat)[int(len(lat) * 0.9)]),
    "loadMs": round(load_ms),
    "procCores": round(run["procCores"], 2),
    "baselineCpuPct": round(base["machineCpuPct"] or 0, 1),
    "addedCpuPct": round((run["machineCpuPct"] or 0) - (base["machineCpuPct"] or 0), 1),
    "nvUtilPct": None if run["nvUtilPct"] is None else round(run["nvUtilPct"], 1),
    "misses": misses,
}
job = os.environ.get("BENCHQ_JOB_DIR")
if job:
    with open(os.path.join(job, "answers.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(answers, f, indent=1, ensure_ascii=False)

head = f"{label}: {total}/{n}, {metrics['medianMs']} ms per sentence, {metrics['procCores']} CPU cores"
write_report(head, [
    f"device: {metrics['deviceName']} ({metrics['engine']})",
    "per language: " + ", ".join(f"{k} {v}/{len(labels)}" for k, v in per_lang.items()),
    f"{unparsed} answers named no label",
    f"latency per sentence: median {metrics['medianMs']} ms, p90 {metrics['p90Ms']} ms",
    f"this process used {metrics['procCores']} CPU cores; machine CPU +{metrics['addedCpuPct']} %; NVIDIA {metrics['nvUtilPct']} %",
    "reference: d1-2B 132/140 (RTX), 131/140 (CPU); not like for like, d1 gives a probability and the app acts above 0.8",
    "misses: " + "; ".join(misses[:40]),
], metrics)
