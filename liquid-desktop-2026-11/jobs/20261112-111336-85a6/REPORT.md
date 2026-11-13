# d1-3B Q4_K_M · cuda: 54.6 tok/s generation, 2986 tok/s prompt, load 1.4 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 4096 tokens in 1.37 s
- generation: 32 tokens, first after 29 ms, temperature 0
- median of 3 runs; generation 54.1 to 55.7 tok/s, prompt 2969.3 to 2987.5 tok/s
- warm-up before measuring: 1061 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
