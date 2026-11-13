# d1-3B Q4_K_M · cuda: 62.6 tok/s generation, 3289.2 tok/s prompt, load 1.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 512 tokens in 0.16 s
- generation: 128 tokens, first after 30 ms, temperature 0
- median of 3 runs; generation 62.2 to 63.2 tok/s, prompt 3202.5 to 3444.7 tok/s
- warm-up before measuring: 2526 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
