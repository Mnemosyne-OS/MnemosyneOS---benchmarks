# LFM2.5-1.2B-Thinking Q4_K_M · cuda: 130.1 tok/s generation, 6822.5 tok/s prompt, load 0.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 696 MB
- prompt: 512 tokens in 0.08 s
- generation: 128 tokens, first after 16 ms, temperature 0
- median of 3 runs; generation 130 to 131.7 tok/s, prompt 6566.5 to 7113.4 tok/s
- warm-up before measuring: 1515 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
