# LFM2-1.2B Q4_K_M · cuda: 131.9 tok/s generation, 7015.9 tok/s prompt, load 0.8 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 512 tokens in 0.07 s
- generation: 128 tokens, first after 15 ms, temperature 0
- median of 3 runs; generation 128.8 to 132.7 tok/s, prompt 5783.7 to 7186.9 tok/s
- warm-up before measuring: 1320 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
