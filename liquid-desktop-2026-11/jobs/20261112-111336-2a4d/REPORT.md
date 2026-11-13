# LFM2.5-2.6B Q4_K_M · cuda: 58 tok/s generation, 3111.2 tok/s prompt, load 1.8 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 512 tokens in 0.16 s
- generation: 128 tokens, first after 28 ms, temperature 0
- median of 3 runs; generation 57.3 to 58.7 tok/s, prompt 2812.2 to 3221 tok/s
- warm-up before measuring: 3339 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
