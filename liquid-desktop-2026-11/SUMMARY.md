# Liquid models on one laptop, November 2026

**What this is:** speed measurements of small language models on one consumer
laptop, across four chips. **It is not a memory score** and nothing here compares
with the LongMemEval or BEAM numbers in this repository.

**Live page:** [index.html](https://mnemosyne-os.github.io/MnemosyneOS---benchmarks/liquid-desktop-2026-11/)
**Recompute every figure on it:** `node verify.js` (exit 0 = every published row
matches the raw job files in `jobs/`).

## Machine

HP laptop, Intel Core Ultra 7 155H (Arc iGPU, AI Boost NPU), NVIDIA RTX 4050
Laptop 6 GB capped at 25 W by the laptop's power profile, 32 GB RAM, Windows 11.
All runs on 2026-11-12.

## Method

- A bench queue runs **one measurement at a time** and reserves the chips it
  uses, so two runs never share the machine.
- GGUF models run through real llama.cpp (node-llama-cpp 3.22.3), on CUDA,
  Vulkan on the RTX, Vulkan on the Arc iGPU, and the CPU. 512-token prompt,
  128 tokens written, one warm-up run thrown away, **median of 3**, min and max
  kept. A second series uses a 4,096-token prompt.
- OpenVINO GenAI 2026.4.1 runs int4 exports on the NPU, the Arc and the CPU.
  The CPU share is measured on the process, in cores.
- Scripts: [`scripts/`](scripts/). Paths to models and private files are
  replaced by `<models>`, `<private>` and similar markers.

## Reading key

| Series | Script | What it measures | Published rows |
|---|---|---|---|
| `gguf-speed-v2` | `gguf-speed.mjs` | tok/s written and read, load time, VRAM | 80 (20 models × 4 chips) |
| `gguf-prompt-4k` | `gguf-speed.mjs --prompt-tokens 4096` | the same with a long prompt | 60 |
| `ov-load` | `ov-speed.py` | OpenVINO tok/s and CPU cores used | 13 |
| `ov-router` | `ov-router.py` | 140 voice commands in 7 languages, intent picked by the model | 6 |
| `ov-longdoc` | `ov-longdoc.py` | first word after a 3,399-token document | 3 |

When a model and chip were run more than once, **the latest successful run is
the one published**. The earlier runs stay in `jobs/`, so the choice can be
checked.

## Runs that did not produce a number

All kept in `jobs/`, never deleted:

- **8 failed with `InsufficientMemoryError`**: LFM2.5-8B-A1B with every layer on
  the 6 GB RTX. Rerun with 20 layers on the GPU; those reruns are the published rows.
- **3 failed with `No sequences left`**: LFM2.5-1.2B-Thinking, 4k prompt, on the
  three GPU paths. A known node-llama-cpp 3.22.3 behaviour (a sequence is
  released asynchronously). Rerun and published.
- **53 cancelled** before they started: none of them wrote any output.

## What is not published, and why

- The **140 router sentences**: the French ones are real spoken commands from
  one person's use of the app. Only per-language scores are published.
- The **3,399-token document** of the long-document test: an internal design
  document. Its token count is in the logs.
- The router test's per-sentence answers, for the same reason as the sentences.

## Caveats

- One machine, one day. A laptop GPU capped at 25 W is slower than the same GPU
  on a desktop.
- Speed only. A fast model can still answer badly; the router series is the only
  one that checks answers, on 140 sentences with labels written by us.
- The Qwen3-1.7B export made for the NPU ran with no error and got 0 of 140
  right on the NPU (61 of 140 on the CPU). We report it as measured; we do not
  know yet whether the export or the NPU path is at fault.
