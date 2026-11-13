# Qwen3.5-4B Q4_K_M · vulkan-nvidia: 33.6 tok/s generation, 1494.8 tok/s prompt, load 5.1 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2605 MB
- prompt: 512 tokens in 0.34 s
- generation: 128 tokens, first after 125 ms, temperature 0
- median of 3 runs; generation 33.3 to 33.8 tok/s, prompt 41.5 to 1509.4 tok/s
- warm-up before measuring: 18805 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
