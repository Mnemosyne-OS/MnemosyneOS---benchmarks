# LFM2-2.6B Q4_K_M · cuda: 58.3 tok/s generation, 2975.8 tok/s prompt, load 1.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 31 layers on GPU)
- file: 1.46 GB, VRAM taken: 1490 MB
- prompt: 4096 tokens in 1.38 s
- generation: 32 tokens, first after 27 ms, temperature 0
- median of 3 runs; generation 58.3 to 58.6 tok/s, prompt 2941.9 to 3005.5 tok/s
- warm-up before measuring: 789 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
