# Qwen3-1.7B Q8_0 · vulkan-nvidia: 54.9 tok/s generation, 3577.3 tok/s prompt, load 3.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1746 MB
- prompt: 512 tokens in 0.14 s
- generation: 126 tokens, first after 35 ms, temperature 0
- median of 3 runs; generation 53.2 to 56.1 tok/s, prompt 89.6 to 4684.8 tok/s
- warm-up before measuring: 6009 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
