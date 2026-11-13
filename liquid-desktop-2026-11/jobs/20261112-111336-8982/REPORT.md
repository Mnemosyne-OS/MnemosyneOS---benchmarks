# Qwen3-1.7B Q8_0 · vulkan-nvidia: 69 tok/s generation, 4532.1 tok/s prompt, load 2.8 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1746 MB
- prompt: 4096 tokens in 0.90 s
- generation: 30 tokens, first after 30 ms, temperature 0
- median of 3 runs; generation 68.1 to 69.8 tok/s, prompt 4150.5 to 4662.3 tok/s
- warm-up before measuring: 804 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
