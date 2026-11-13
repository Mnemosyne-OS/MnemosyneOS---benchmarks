# LFM2.5-8B-A1B Q4_K_M · vulkan-nvidia: 37.8 tok/s generation, 1050.4 tok/s prompt, load 5.6 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 20 layers on GPU, PARTIAL: the model does not fit in this card, the rest runs on the CPU)
- file: 4.8 GB, VRAM taken: 4560 MB
- prompt: 4096 tokens in 3.90 s
- generation: 31 tokens, first after 764 ms, temperature 0
- median of 3 runs; generation 31.2 to 47.4 tok/s, prompt 974 to 1197 tok/s
- warm-up before measuring: 3175 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
