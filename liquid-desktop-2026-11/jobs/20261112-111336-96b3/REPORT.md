# Qwen3-1.7B Q8_0 · cuda: 63.5 tok/s generation, 4394.1 tok/s prompt, load 1.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1744 MB
- prompt: 4096 tokens in 0.93 s
- generation: 30 tokens, first after 24 ms, temperature 0
- median of 3 runs; generation 61.9 to 67.5 tok/s, prompt 4363.6 to 4510.4 tok/s
- warm-up before measuring: 756 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
