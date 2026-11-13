# granite-4.2-3b Q4_K_M · cuda: 44.6 tok/s generation, 2432.2 tok/s prompt, load 1.7 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 41 layers on GPU)
- file: 2.09 GB, VRAM taken: 2000 MB
- prompt: 512 tokens in 0.21 s
- generation: 128 tokens, first after 42 ms, temperature 0
- median of 3 runs; generation 44.2 to 44.9 tok/s, prompt 2407.4 to 2441.2 tok/s
- warm-up before measuring: 8886 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
