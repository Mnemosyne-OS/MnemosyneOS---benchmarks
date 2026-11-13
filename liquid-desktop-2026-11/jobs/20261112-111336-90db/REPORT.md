# LFM2.5-1.2B-Thinking Q4_K_M · cuda: 137.3 tok/s generation, 6550 tok/s prompt, load 0.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 4096 tokens in 0.63 s
- generation: 32 tokens, first after 17 ms, temperature 0
- median of 3 runs; generation 136.4 to 139.4 tok/s, prompt 6531.7 to 6563.4 tok/s
- warm-up before measuring: 686 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
