# LFM2.5-2.6B Q4_K_M · cuda: 61.6 tok/s generation, 3033.3 tok/s prompt, load 1.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 4096 tokens in 1.35 s
- generation: 32 tokens, first after 29 ms, temperature 0
- median of 3 runs; generation 61.5 to 62.1 tok/s, prompt 3025 to 3054.7 tok/s
- warm-up before measuring: 1553 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
