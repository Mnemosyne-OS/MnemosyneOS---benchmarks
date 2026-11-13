# LFM2.5-1.2B Q4_K_M · vulkan-nvidia: 152 tok/s generation, 6057 tok/s prompt, load 1.4 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 17 layers on GPU)
- file: 0.68 GB, VRAM taken: 697 MB
- prompt: 4096 tokens in 0.68 s
- generation: 32 tokens, first after 21 ms, temperature 0
- median of 3 runs; generation 138.8 to 154 tok/s, prompt 5639.8 to 6167.7 tok/s
- warm-up before measuring: 533 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
