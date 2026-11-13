# Qwen3-4B Q4_K_M · vulkan-nvidia: 48.2 tok/s generation, 1974 tok/s prompt, load 3.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2378 MB
- prompt: 4096 tokens in 2.07 s
- generation: 30 tokens, first after 64 ms, temperature 0
- median of 3 runs; generation 48.2 to 49.5 tok/s, prompt 1878 to 2021.4 tok/s
- warm-up before measuring: 1157 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
