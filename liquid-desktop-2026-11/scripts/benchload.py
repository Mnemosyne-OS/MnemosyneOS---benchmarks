"""What a run takes from the machine: this process's CPU cores, machine CPU, NVIDIA load, RAM.

Shared by the OpenVINO bench scripts. Scripts run with `python -I`, which leaves the
script's folder off sys.path, so each caller inserts this folder explicitly.
"""
import os
import statistics
import subprocess
import sys
import threading
import time

import psutil


def nvidia_util():
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=utilization.gpu,memory.used", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=5,
        ).stdout.strip().splitlines()[0]
        u, m = (float(x) for x in out.split(","))
        return u, m
    except Exception as err:  # no card, no driver, or a slow answer: the sample is skipped
        print(f"benchload: nvidia-smi sample skipped ({err})", file=sys.stderr)
        return None, None


class Sampler:
    """Machine CPU %, NVIDIA load and this process's CPU time, every 0.5 s."""

    def __init__(self, nvidia=True):
        self.proc = psutil.Process()
        self.nvidia = nvidia
        self.samples = []
        self._stop = threading.Event()
        self._t = None

    def _run(self):
        psutil.cpu_percent(None)
        while not self._stop.wait(0.5):
            nv = nvidia_util()[0] if self.nvidia else None
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
        vals = lambda k: [s[k] for s in self.samples if s[k] is not None]
        return {
            "wall": wall,
            "procCores": cpu / wall if wall > 0 else None,
            "machineCpuPct": statistics.mean(vals("cpu")) if vals("cpu") else None,
            "nvUtilPct": statistics.mean(vals("nv")) if vals("nv") else None,
            "rssMB": max((s["rss"] for s in self.samples), default=self.proc.memory_info().rss) / 1048576,
        }


def baseline(seconds):
    """The machine idle before anything loads: what the user's open apps already take."""
    s = Sampler()
    s.start()
    time.sleep(seconds)
    return s.stop()


def write_report(head, lines, metrics):
    """metrics.json + REPORT.md into the benchq job folder, when run by benchq."""
    import json

    job = os.environ.get("BENCHQ_JOB_DIR")
    print(head)
    print(json.dumps(metrics, indent=2, ensure_ascii=False))
    if not job:
        return
    with open(os.path.join(job, "metrics.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)
    with open(os.path.join(job, "REPORT.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(f"# {head}\n\n" + "".join(f"- {l}\n" for l in lines))


def fail(label, msg):
    job = os.environ.get("BENCHQ_JOB_DIR")
    print(f"{label}: {msg}", file=sys.stderr)
    if job:
        with open(os.path.join(job, "REPORT.md"), "w", encoding="utf-8", newline="\n") as f:
            f.write(f"# {label}: not measured\n\n{msg}\n")
    sys.exit(1)
