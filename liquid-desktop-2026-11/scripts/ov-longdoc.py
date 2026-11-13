"""A long document summarised by a small LLM on one OpenVINO device: does the device take a
long input, how long until the first word, how fast after, and what it costs the CPU.

The NPU compiles for a fixed maximum prompt length (MAX_PROMPT_LEN): a background job that
summarises documents needs that length set high, and the compile and the prefill grow with
it. The CPU and the Arc have no such limit.

The document is a frozen file (the caller passes it), so two runs read the same text.
The summaries go to summary.txt in the job folder; the NPU's is compared with the CPU's by
shared vocabulary when --cpu-summary points at the CPU run's file.

usage: python -I ov-longdoc.py --model <dir> --device NPU|CPU|GPU.0 --doc <txt>
         [--max-prompt 4096] [--gen 160] [--name <label>] [--cpu-summary <txt>]
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8")

import openvino as ov  # noqa: E402
import openvino_genai as ovg  # noqa: E402
from benchload import Sampler, baseline, fail, write_report  # noqa: E402

p = argparse.ArgumentParser()
p.add_argument("--model", required=True)
p.add_argument("--device", required=True)
p.add_argument("--doc", required=True)
p.add_argument("--max-prompt", type=int, default=4096)
p.add_argument("--gen", type=int, default=160)
p.add_argument("--name", default=None)
p.add_argument("--cpu-summary", default=None)
p.add_argument("--baseline", type=float, default=10.0)
a = p.parse_args()
name = a.name or os.path.basename(a.model.rstrip("\\/"))
label = f"longdoc {name} · {a.device}"

core = ov.Core()
if a.device not in core.available_devices:
    fail(label, f"device {a.device} not seen by OpenVINO ({core.available_devices})")
with open(a.doc, encoding="utf-8") as f:
    doc = f.read()
ask = f"Résume ce document en 5 phrases, en français.\n\n---\n{doc}\n---"

base = baseline(a.baseline)
cfg = {"CACHE_DIR": os.path.join(a.model, ".ov-cache")}
if a.device == "NPU":
    cfg.update({"MAX_PROMPT_LEN": a.max_prompt, "MIN_RESPONSE_LEN": a.gen})
t = time.perf_counter()
try:
    pipe = ovg.LLMPipeline(a.model, a.device, **cfg)
except Exception as err:
    fail(label, f"could not load on {a.device} with a {a.max_prompt}-token prompt: {str(err)[:400]}")
load_ms = (time.perf_counter() - t) * 1000
prompt_tokens = int(pipe.get_tokenizer().encode(ask).input_ids.get_shape()[-1])

g = ovg.GenerationConfig()
g.max_new_tokens = a.gen
g.do_sample = False
s = Sampler()
s.start()
try:
    res = pipe.generate([ask], g)
except Exception as err:
    fail(label, f"generation failed with a {prompt_tokens}-token prompt: {str(err)[:400]}")
run = s.stop()
pm = res.perf_metrics
text = str(res.texts[0]).strip()

overlap = None
if a.cpu_summary and os.path.exists(a.cpu_summary):
    words = lambda t: {w.strip(".,;:!?()«»\"'").lower() for w in t.split() if len(w) > 3}
    with open(a.cpu_summary, encoding="utf-8") as f:
        x, y = words(text), words(f.read())
    overlap = round(len(x & y) / max(1, min(len(x), len(y))), 2)

job = os.environ.get("BENCHQ_JOB_DIR")
if job:
    with open(os.path.join(job, "summary.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write(text + "\n")

m = {
    "model": name, "device": a.device, "deviceName": core.get_property(a.device, "FULL_DEVICE_NAME"),
    "promptTokens": prompt_tokens, "maxPrompt": a.max_prompt if a.device == "NPU" else None,
    "loadMs": round(load_ms), "firstTokenMs": round(pm.get_ttft().mean),
    "genTokPerSec": round(pm.get_throughput().mean, 1), "totalS": round(run["wall"], 1),
    "procCores": round(run["procCores"], 2),
    "addedCpuPct": round((run["machineCpuPct"] or 0) - (base["machineCpuPct"] or 0), 1),
    "rssMB": round(run["rssMB"]), "overlapWithCpu": overlap,
}
head = (f"{label}: {prompt_tokens}-token document, first word after {m['firstTokenMs'] / 1000:.1f} s, "
        f"{m['genTokPerSec']} tok/s, {m['procCores']} CPU cores")
write_report(head, [
    f"device: {m['deviceName']}" + (f", compiled for prompts up to {a.max_prompt} tokens" if a.device == "NPU" else ""),
    f"load (and NPU compile on a first run): {m['loadMs']} ms",
    f"whole summary: {m['totalS']} s; this process used {m['procCores']} CPU cores, machine CPU +{m['addedCpuPct']} %",
    f"vocabulary shared with the CPU's summary: {overlap if overlap is not None else 'not compared'}",
    f"RAM of the process {m['rssMB']} MB",
], m)
