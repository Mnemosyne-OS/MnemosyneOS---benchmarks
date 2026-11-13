# Qwen3-4B Q4_K_M · cuda: 43.9 tok/s generation, 1865.2 tok/s prompt, load 2.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2376 MB
- prompt: 4096 tokens in 2.20 s
- generation: 30 tokens, first after 42 ms, temperature 0
- median of 3 runs; generation 40.5 to 44.9 tok/s, prompt 1750.1 to 1941.2 tok/s
- warm-up before measuring: 1122 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
