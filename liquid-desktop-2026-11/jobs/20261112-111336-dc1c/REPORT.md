# d1-2B Q4_K_M · vulkan-nvidia: 75.2 tok/s generation, 4027.3 tok/s prompt, load 1.7 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 4096 tokens in 1.02 s
- generation: 32 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 73.8 to 75.6 tok/s, prompt 4025.1 to 4457.1 tok/s
- warm-up before measuring: 1669 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
