# LFM2-2.6B Q4_K_M · cuda: 66.9 tok/s generation, 3131.7 tok/s prompt, load 1.7 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.46 GB, VRAM taken: 1490 MB
- prompt: 512 tokens in 0.16 s
- generation: 128 tokens, first after 29 ms, temperature 0
- median of 3 runs; generation 64.3 to 68 tok/s, prompt 3129.4 to 3160.5 tok/s
- warm-up before measuring: 2333 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
