# LFM2-2.6B Q4_K_M · vulkan-nvidia: 66.8 tok/s generation, 2520 tok/s prompt, load 2.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.46 GB, VRAM taken: 1491 MB
- prompt: 512 tokens in 0.20 s
- generation: 128 tokens, first after 49 ms, temperature 0
- median of 3 runs; generation 65.3 to 67 tok/s, prompt 2494.1 to 2733.5 tok/s
- warm-up before measuring: 2426 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
