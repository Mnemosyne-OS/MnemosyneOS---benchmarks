# Qwen3-4B Q4_K_M · vulkan-nvidia: 43.4 tok/s generation, 1986.7 tok/s prompt, load 3.8 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2378 MB
- prompt: 512 tokens in 0.26 s
- generation: 126 tokens, first after 71 ms, temperature 0
- median of 3 runs; generation 40.1 to 46.5 tok/s, prompt 1839 to 2099 tok/s
- warm-up before measuring: 3698 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
