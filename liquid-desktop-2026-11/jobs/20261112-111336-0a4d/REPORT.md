# LFM2.5-230M Q4_K_M · cuda: 393.4 tok/s generation, 27603.5 tok/s prompt, load 0.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 15 layers on GPU)
- file: 0.14 GB, VRAM taken: 146 MB
- prompt: 4096 tokens in 0.15 s
- generation: 32 tokens, first after 9 ms, temperature 0
- median of 3 runs; generation 372.9 to 396.6 tok/s, prompt 27467 to 27787.7 tok/s
- warm-up before measuring: 1336 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
