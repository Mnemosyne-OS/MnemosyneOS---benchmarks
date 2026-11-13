# LFM3-1.7B Q4_K_M · vulkan-nvidia: 73.8 tok/s generation, 4044.1 tok/s prompt, load 2.1 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 4096 tokens in 1.01 s
- generation: 32 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 72.5 to 75.4 tok/s, prompt 4031.1 to 4069.6 tok/s
- warm-up before measuring: 1746 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
