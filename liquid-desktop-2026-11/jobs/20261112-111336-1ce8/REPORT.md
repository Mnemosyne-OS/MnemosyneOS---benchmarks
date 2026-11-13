# granite-4.2-3b Q4_K_M · cuda: 52.3 tok/s generation, 2241.8 tok/s prompt, load 1.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 41 layers on GPU)
- file: 2.09 GB, VRAM taken: 2000 MB
- prompt: 4096 tokens in 1.83 s
- generation: 32 tokens, first after 40 ms, temperature 0
- median of 3 runs; generation 52 to 54.5 tok/s, prompt 2148.1 to 2251.6 tok/s
- warm-up before measuring: 1722 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
