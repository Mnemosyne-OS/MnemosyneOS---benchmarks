# LFM2.5-2.6B Q4_K_M · vulkan-nvidia: 53.4 tok/s generation, 2658.2 tok/s prompt, load 2.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1591 MB
- prompt: 4096 tokens in 1.54 s
- generation: 32 tokens, first after 46 ms, temperature 0
- median of 3 runs; generation 6.1 to 61.5 tok/s, prompt 542.1 to 2737.5 tok/s
- warm-up before measuring: 1498 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
