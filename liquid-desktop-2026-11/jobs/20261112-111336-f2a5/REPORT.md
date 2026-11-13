# Qwen3.5-4B Q4_K_M · cuda: 35.9 tok/s generation, 1842.8 tok/s prompt, load 2.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2604 MB
- prompt: 4096 tokens in 2.22 s
- generation: 32 tokens, first after 68 ms, temperature 0
- median of 3 runs; generation 33.1 to 36 tok/s, prompt 1754.3 to 1886.2 tok/s
- warm-up before measuring: 1331 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
