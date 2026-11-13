# LFM3-VL-2B Q4_K_M · cuda: 85.8 tok/s generation, 4582.4 tok/s prompt, load 1.4 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 0.89 s
- generation: 32 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 85.5 to 86.4 tok/s, prompt 4564.3 to 4623.8 tok/s
- warm-up before measuring: 1625 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
