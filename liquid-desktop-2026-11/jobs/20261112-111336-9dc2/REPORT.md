# Qwen3.5-4B Q4_K_M · vulkan-nvidia: 41 tok/s generation, 1517.2 tok/s prompt, load 4.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2605 MB
- prompt: 4096 tokens in 2.70 s
- generation: 32 tokens, first after 102 ms, temperature 0
- median of 3 runs; generation 39 to 41.2 tok/s, prompt 1446 to 1570.4 tok/s
- warm-up before measuring: 1446 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
