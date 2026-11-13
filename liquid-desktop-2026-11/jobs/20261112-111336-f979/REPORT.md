# SmolLM3-3B Q4_K_M · cuda: 48.9 tok/s generation, 2790.6 tok/s prompt, load 2.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1820 MB
- prompt: 512 tokens in 0.18 s
- generation: 125 tokens, first after 45 ms, temperature 0
- median of 3 runs; generation 46.8 to 49.9 tok/s, prompt 2790.5 to 2801.5 tok/s
- warm-up before measuring: 5542 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
