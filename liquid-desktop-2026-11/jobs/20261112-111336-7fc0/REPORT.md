# LFM2.5-1.2B Q4_K_M · cuda: 143 tok/s generation, 6635.4 tok/s prompt, load 0.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 4096 tokens in 0.62 s
- generation: 32 tokens, first after 15 ms, temperature 0
- median of 3 runs; generation 142.7 to 144.3 tok/s, prompt 6628.4 to 6651.2 tok/s
- warm-up before measuring: 525 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
