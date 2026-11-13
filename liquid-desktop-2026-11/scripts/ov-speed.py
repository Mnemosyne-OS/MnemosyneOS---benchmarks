"""Speed of one OpenVINO model on one device, and what it takes from the rest of the machine.

The question is not only "how fast" but "what does it cost the machine": a model on the
NPU may be slower and still the better choice if it leaves the CPU and the GPUs free.
So every run first measures the machine idle (the user's apps included), then reports
what the run ADDS: CPU cores used by this process, machine CPU above the idle level,
NVIDIA load, RAM.

usage: python -I ov-speed.py --model <dir> --device NPU|CPU|GPU.0|GPU.1
         [--gen 128] [--repeat 3] [--name <label>] [--baseline 10]
Writes metrics.json and REPORT.md into $BENCHQ_JOB_DIR when run by benchq.
"""
import argparse
import json
import os
import statistics
import subprocess
import sys
import threading
import time

import psutil
import openvino as ov
import openvino_genai as ovg

# The Windows console is cp1252: the report uses characters it cannot print.
sys.stdout.reconfigure(encoding="utf-8")

p = argparse.ArgumentParser()
p.add_argument("--model", required=True)
p.add_argument("--device", required=True)
p.add_argument("--gen", type=int, default=128)
p.add_argument("--repeat", type=int, default=3)
p.add_argument("--name", default=None)
p.add_argument("--baseline", type=float, default=10.0)
a = p.parse_args()

label = a.name or os.path.basename(a.model.rstrip("\\/"))
job_dir = os.environ.get("BENCHQ_JOB_DIR")
ASK = "Write a long story about a lighthouse keeper and the ships he saw."


def die(msg):
    print(f"ov-speed: {msg}", file=sys.stderr)
    if job_dir:
        with open(os.path.join(job_dir, "REPORT.md"), "w", encoding="utf-8", newline="\n") as f:
            f.write(f"# {label} · {a.device}: not measured\n\n{msg}\n")
    sys.exit(1)


core = ov.Core()
if a.device not in core.available_devices:
    die(f"device {a.device} not seen by OpenVINO (it sees {core.available_devices})")
device_name = core.get_property(a.device, "FULL_DEVICE_NAME")


def nvidia_util():
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=utilization.gpu,memory.used", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=5,
        ).stdout.strip().splitlines()[0]
        u, m = (float(x) for x in out.split(","))
        return u, m
    except Exception as err:  # no card, no driver, or a slow answer: the sample is skipped
        print(f"ov-speed: nvidia-smi sample skipped ({err})", file=sys.stderr)
        return None, None


class Sampler:
    """Machine CPU %, NVIDIA load and this process's CPU time, every 0.5 s."""

    def __init__(self):
        self.proc = psutil.Process()
        self.samples = []
        self._stop = threading.Event()
        self._t = None

    def _run(self):
        psutil.cpu_percent(None)
        while not self._stop.wait(0.5):
            nv, _ = nvidia_util()
            self.samples.append({"cpu": psutil.cpu_percent(None), "nv": nv, "rss": self.proc.memory_info().rss})

    def start(self):
        self.samples = []
        self._stop.clear()
        self.cpu0 = sum(self.proc.cpu_times()[:2])
        self.t0 = time.perf_counter()
        self._t = threading.Thread(target=self._run, daemon=True)
        self._t.start()

    def stop(self):
        self._stop.set()
        self._t.join()
        wall = time.perf_counter() - self.t0
        cpu = sum(self.proc.cpu_times()[:2]) - self.cpu0
        mean = lambda k: statistics.mean([s[k] for s in self.samples if s[k] is not None]) if any(s[k] is not None for s in self.samples) else None
        return {
            "wall": wall,
            "procCores": cpu / wall if wall > 0 else None,
            "machineCpuPct": mean("cpu"),
            "nvUtilPct": mean("nv"),
            "rssMB": max((s["rss"] for s in self.samples), default=self.proc.memory_info().rss) / 1048576,
        }


# 1. The machine idle, before anything is loaded: what is left once the user's apps run.
print(f"ov-speed: measuring the idle machine for {a.baseline:.0f} s")
s = Sampler()
s.start()
time.sleep(a.baseline)
base = s.stop()

# 2. Load. The NPU compiles for fixed shapes; the compiled blob is cached next to the model
#    so the next run does not pay it again (measured: 10 to 50 s per shape).
cfg = {"CACHE_DIR": os.path.join(a.model, ".ov-cache")}
if a.device == "NPU":
    cfg.update({"MAX_PROMPT_LEN": 1024, "MIN_RESPONSE_LEN": a.gen})
t = time.perf_counter()
try:
    pipe = ovg.LLMPipeline(a.model, a.device, **cfg)
except Exception as err:
    die(f"could not load on {a.device}: {err}")
load_ms = (time.perf_counter() - t) * 1000

gen_cfg = ovg.GenerationConfig()
gen_cfg.max_new_tokens = a.gen
gen_cfg.ignore_eos = True  # every model, every device: the same number of tokens
gen_cfg.do_sample = False

# 3. Warm-up, not measured.
w = ovg.GenerationConfig()
w.max_new_tokens = 8
pipe.generate("Hello", w)

gen_rates, ttfts, loads = [], [], []
for r in range(a.repeat):
    s.start()
    res = pipe.generate([ASK], gen_cfg)
    run = s.stop()
    pm = res.perf_metrics
    gen_rates.append(pm.get_throughput().mean)
    ttfts.append(pm.get_ttft().mean)
    loads.append(run)

med = statistics.median
metrics = {
    "model": label,
    "device": a.device,
    "deviceName": device_name,
    "engine": f"openvino-genai {ovg.__version__}",
    "loadMs": round(load_ms),
    "genTokens": a.gen,
    "genTokPerSec": round(med(gen_rates), 1),
    "genTokPerSecMin": round(min(gen_rates), 1),
    "genTokPerSecMax": round(max(gen_rates), 1),
    "firstTokenMs": round(med(ttfts)),
    "repeat": a.repeat,
    # What the run takes from the machine (medians over the runs).
    "procCores": round(med([x["procCores"] for x in loads]), 2),
    "baselineCpuPct": round(base["machineCpuPct"] or 0, 1),
    "machineCpuPct": round(med([x["machineCpuPct"] or 0 for x in loads]), 1),
    "addedCpuPct": round(med([x["machineCpuPct"] or 0 for x in loads]) - (base["machineCpuPct"] or 0), 1),
    "baselineNvPct": None if base["nvUtilPct"] is None else round(base["nvUtilPct"], 1),
    "nvUtilPct": None if loads[0]["nvUtilPct"] is None else round(med([x["nvUtilPct"] or 0 for x in loads]), 1),
    "rssMB": round(max(x["rssMB"] for x in loads)),
    "logicalCpus": psutil.cpu_count(),
}

head = (
    f"{label} · {a.device}: {metrics['genTokPerSec']} tok/s, "
    f"{metrics['procCores']} CPU cores used, +{metrics['addedCpuPct']} % machine CPU"
)
print(head)
print(json.dumps(metrics, indent=2))
if job_dir:
    with open(os.path.join(job_dir, "metrics.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(metrics, f, indent=2)
    with open(os.path.join(job_dir, "REPORT.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(
            f"# {head}\n\n"
            f"- device: {device_name} ({metrics['engine']})\n"
            f"- generation: {a.gen} tokens, median of {a.repeat} runs, {metrics['genTokPerSecMin']} to {metrics['genTokPerSecMax']} tok/s, first token after {metrics['firstTokenMs']} ms\n"
            f"- machine idle before the run: {metrics['baselineCpuPct']} % CPU over {a.baseline:.0f} s (the apps already open)\n"
            f"- during the run: {metrics['machineCpuPct']} % CPU, so +{metrics['addedCpuPct']} %; this process used {metrics['procCores']} of {metrics['logicalCpus']} logical cores\n"
            f"- NVIDIA load: {metrics['baselineNvPct']} % idle, {metrics['nvUtilPct']} % during; RAM of the process {metrics['rssMB']} MB\n"
            f"- load (and NPU compile on a first run): {metrics['loadMs']} ms\n"
        )
