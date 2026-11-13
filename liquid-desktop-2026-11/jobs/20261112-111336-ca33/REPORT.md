# LFM2-2.6B Q4_K_M · vulkan-nvidia: 54.9 tok/s generation, 2418.2 tok/s prompt, load 2.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.46 GB, VRAM taken: 1491 MB
- prompt: 4096 tokens in 1.69 s
- generation: 32 tokens, first after 49 ms, temperature 0
- median of 3 runs; generation 52.4 to 55.2 tok/s, prompt 2416.1 to 2421.8 tok/s
- warm-up before measuring: 968 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
