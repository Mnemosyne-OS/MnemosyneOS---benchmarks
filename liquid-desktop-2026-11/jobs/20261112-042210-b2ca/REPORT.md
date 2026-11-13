# LFM3-1.7B Q4_K_M · cuda: 104.1 tok/s generation, 5915 tok/s prompt, load 1.9 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 0.69 s
- generation: 32 tokens, first after 17 ms, temperature 0
- median of 3 runs; generation 96 to 106.8 tok/s, prompt 5833.2 to 5933.3 tok/s
- warm-up before measuring: 189 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
