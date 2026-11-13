# d1-3B Q4_K_M · vulkan-nvidia: 64.5 tok/s generation, 2621.9 tok/s prompt, load 2.4 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1591 MB
- prompt: 512 tokens in 0.20 s
- generation: 128 tokens, first after 51 ms, temperature 0
- median of 3 runs; generation 63.9 to 66.9 tok/s, prompt 2536.2 to 2872.4 tok/s
- warm-up before measuring: 2825 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
