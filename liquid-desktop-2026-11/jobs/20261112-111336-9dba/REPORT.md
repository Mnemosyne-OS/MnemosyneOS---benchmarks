# d1-3B Q4_K_M · vulkan-nvidia: 55 tok/s generation, 2568.6 tok/s prompt, load 2.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1591 MB
- prompt: 4096 tokens in 1.59 s
- generation: 32 tokens, first after 45 ms, temperature 0
- median of 3 runs; generation 53.5 to 57.9 tok/s, prompt 2518.8 to 2799.7 tok/s
- warm-up before measuring: 1126 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
