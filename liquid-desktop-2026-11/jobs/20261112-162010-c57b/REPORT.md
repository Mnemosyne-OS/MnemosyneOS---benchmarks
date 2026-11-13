# Qwen3-1.7B-npu-export · NPU: 22.8 tok/s, 0.07 CPU cores used, +-7.8 % machine CPU

- device: Intel(R) AI Boost (openvino-genai 2026.4.1.0-3408-ab01d1771e4)
- generation: 128 tokens, median of 3 runs, 21.4 to 23.3 tok/s, first token after 1311 ms
- machine idle before the run: 21.2 % CPU over 10 s (the apps already open)
- during the run: 13.4 % CPU, so +-7.8 %; this process used 0.07 of 22 logical cores
- NVIDIA load: 0.0 % idle, 0 % during; RAM of the process 2312 MB
- load (and NPU compile on a first run): 15037 ms
