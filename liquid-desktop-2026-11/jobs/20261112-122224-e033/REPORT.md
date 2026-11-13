# LFM2.5-8B-A1B Q4_K_M · cuda: 39.3 tok/s generation, 1233.1 tok/s prompt, load 3.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 20 layers on GPU, PARTIAL: the model does not fit in this card, the rest runs on the CPU)
- file: 4.8 GB, VRAM taken: 4556 MB
- prompt: 4096 tokens in 3.32 s
- generation: 31 tokens, first after 471 ms, temperature 0
- median of 3 runs; generation 36.4 to 41.2 tok/s, prompt 1165.1 to 1239.9 tok/s
- warm-up before measuring: 3339 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
