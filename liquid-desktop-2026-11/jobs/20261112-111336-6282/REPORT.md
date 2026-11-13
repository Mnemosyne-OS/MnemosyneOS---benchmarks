# LFM3-1.7B Q4_K_M · cuda: 86 tok/s generation, 5208.4 tok/s prompt, load 1.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 512 tokens in 0.10 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 85.8 to 88.5 tok/s, prompt 5178 to 5532 tok/s
- warm-up before measuring: 3680 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
