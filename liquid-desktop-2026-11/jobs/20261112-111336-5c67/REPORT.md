# LFM2.5-1.2B Q4_K_M · cuda: 131.5 tok/s generation, 7176.1 tok/s prompt, load 0.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 512 tokens in 0.07 s
- generation: 128 tokens, first after 16 ms, temperature 0
- median of 3 runs; generation 130.1 to 134.1 tok/s, prompt 7161.7 to 7206.6 tok/s
- warm-up before measuring: 1301 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
