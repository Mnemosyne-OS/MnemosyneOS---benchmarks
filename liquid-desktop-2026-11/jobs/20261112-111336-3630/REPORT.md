# LFM2.5-350M Q4_K_M · cuda: 358.3 tok/s generation, 19578.2 tok/s prompt, load 0.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.21 GB, VRAM taken: 218 MB
- prompt: 4096 tokens in 0.21 s
- generation: 32 tokens, first after 8 ms, temperature 0
- median of 3 runs; generation 356.6 to 358.9 tok/s, prompt 19577.3 to 19645.4 tok/s
- warm-up before measuring: 457 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
