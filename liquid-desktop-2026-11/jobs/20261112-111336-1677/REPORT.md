# LFM3-1.7B Q4_K_M · vulkan-nvidia: 87.4 tok/s generation, 4219.9 tok/s prompt, load 2.1 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 512 tokens in 0.12 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 85.1 to 87.7 tok/s, prompt 4206.4 to 4346.7 tok/s
- warm-up before measuring: 2965 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
