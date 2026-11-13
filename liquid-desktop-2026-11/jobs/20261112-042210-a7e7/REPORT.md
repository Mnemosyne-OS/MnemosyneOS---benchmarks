# d1-2B Q4_K_M · vulkan-nvidia: 91.1 tok/s generation, 5107.3 tok/s prompt, load 2.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 4096 tokens in 0.80 s
- generation: 32 tokens, first after 25 ms, temperature 0
- median of 3 runs; generation 90.3 to 94.1 tok/s, prompt 5047.6 to 5206.4 tok/s
- warm-up before measuring: 158 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
