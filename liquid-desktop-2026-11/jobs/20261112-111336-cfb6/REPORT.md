# SmolLM3-3B Q4_K_M · vulkan-nvidia: 39.9 tok/s generation, 2238.5 tok/s prompt, load 3.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1821 MB
- prompt: 4096 tokens in 1.83 s
- generation: 29 tokens, first after 66 ms, temperature 0
- median of 3 runs; generation 39.3 to 54.5 tok/s, prompt 2172.4 to 2250.1 tok/s
- warm-up before measuring: 2527 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
