# LFM3-1.7B Q4_K_M · vulkan-nvidia: 107 tok/s generation, 5070.3 tok/s prompt, load 5.4 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 4096 tokens in 0.81 s
- generation: 32 tokens, first after 25 ms, temperature 0
- median of 3 runs; generation 104.9 to 108.9 tok/s, prompt 4940.1 to 5110 tok/s
- warm-up before measuring: 170 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
