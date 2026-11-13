# d1-2B Q4_K_M · cuda: 98.6 tok/s generation, 6095.3 tok/s prompt, load 1.7 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 0.67 s
- generation: 32 tokens, first after 17 ms, temperature 0
- median of 3 runs; generation 96.3 to 101.6 tok/s, prompt 6038.8 to 6174.5 tok/s
- warm-up before measuring: 222 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
