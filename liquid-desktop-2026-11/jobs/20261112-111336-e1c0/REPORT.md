# LFM2-1.2B Q4_K_M · cuda: 138.3 tok/s generation, 6537.3 tok/s prompt, load 0.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 4096 tokens in 0.63 s
- generation: 32 tokens, first after 15 ms, temperature 0
- median of 3 runs; generation 138.2 to 138.9 tok/s, prompt 6430.7 to 6733.6 tok/s
- warm-up before measuring: 489 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
