# Phi-4-mini Q4_K_M · cuda: 43.4 tok/s generation, 2438.7 tok/s prompt, load 2.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 33 layers on GPU)
- file: 2.32 GB, VRAM taken: 2370 MB
- prompt: 512 tokens in 0.21 s
- generation: 128 tokens, first after 38 ms, temperature 0
- median of 3 runs; generation 42.7 to 43.5 tok/s, prompt 2414.9 to 2612.2 tok/s
- warm-up before measuring: 4212 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
