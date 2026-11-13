# LFM2.5-1.2B Q4_K_M · cuda: 170.4 tok/s generation, 8277 tok/s prompt, load 0.7 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 4096 tokens in 0.49 s
- generation: 32 tokens, first after 10 ms, temperature 0
- median of 3 runs; generation 165.5 to 172.4 tok/s, prompt 8181.6 to 8355.4 tok/s
- warm-up before measuring: 144 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
