# SmolLM3-3B Q4_K_M · vulkan-nvidia: 53 tok/s generation, 2467 tok/s prompt, load 3.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1821 MB
- prompt: 512 tokens in 0.21 s
- generation: 125 tokens, first after 63 ms, temperature 0
- median of 3 runs; generation 52.5 to 58.1 tok/s, prompt 2424.3 to 2580 tok/s
- warm-up before measuring: 4531 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
