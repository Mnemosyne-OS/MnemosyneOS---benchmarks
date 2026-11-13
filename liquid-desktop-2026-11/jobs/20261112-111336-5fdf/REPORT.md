# d1-2B Q4_K_M · cuda: 80 tok/s generation, 4865.8 tok/s prompt, load 1.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 0.84 s
- generation: 32 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 79.7 to 82.6 tok/s, prompt 4855.4 to 4868.6 tok/s
- warm-up before measuring: 1999 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
