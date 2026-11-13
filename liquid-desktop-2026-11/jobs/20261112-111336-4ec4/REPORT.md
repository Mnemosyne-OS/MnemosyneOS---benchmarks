# d1-2B Q4_K_M · vulkan-nvidia: 76.5 tok/s generation, 4076.3 tok/s prompt, load 1.9 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 512 tokens in 0.13 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 75.2 to 76.9 tok/s, prompt 3875.8 to 4446.2 tok/s
- warm-up before measuring: 2789 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
