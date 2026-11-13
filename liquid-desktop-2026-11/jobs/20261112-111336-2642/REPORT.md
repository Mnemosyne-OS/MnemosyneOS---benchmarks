# SmolLM3-3B Q4_K_M · cuda: 44.4 tok/s generation, 2362.9 tok/s prompt, load 2.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1820 MB
- prompt: 4096 tokens in 1.73 s
- generation: 29 tokens, first after 57 ms, temperature 0
- median of 3 runs; generation 44.1 to 44.7 tok/s, prompt 2307 to 2373.5 tok/s
- warm-up before measuring: 2671 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
