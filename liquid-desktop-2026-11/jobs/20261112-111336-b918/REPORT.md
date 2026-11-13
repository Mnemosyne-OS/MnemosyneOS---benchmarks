# LFM3-VL-2B Q4_K_M · vulkan-nvidia: 81.4 tok/s generation, 4412.4 tok/s prompt, load 2.5 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1043 MB
- prompt: 512 tokens in 0.12 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 80.4 to 86.8 tok/s, prompt 4091.3 to 4443.4 tok/s
- warm-up before measuring: 3528 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
