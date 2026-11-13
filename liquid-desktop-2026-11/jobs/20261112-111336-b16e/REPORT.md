# LFM2.5-2.6B Q4_K_M · vulkan-nvidia: 58 tok/s generation, 2582.6 tok/s prompt, load 2.8 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1591 MB
- prompt: 512 tokens in 0.20 s
- generation: 128 tokens, first after 49 ms, temperature 0
- median of 3 runs; generation 57.7 to 60.2 tok/s, prompt 2478.7 to 2587.6 tok/s
- warm-up before measuring: 3174 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
