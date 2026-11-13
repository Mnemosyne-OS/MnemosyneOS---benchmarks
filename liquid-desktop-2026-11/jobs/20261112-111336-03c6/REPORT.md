# d1-2B Q4_K_M · cuda: 84.4 tok/s generation, 5278.2 tok/s prompt, load 1.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 512 tokens in 0.10 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 83.7 to 84.8 tok/s, prompt 5217.4 to 5306.8 tok/s
- warm-up before measuring: 2520 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
