# LFM2.5-8B-A1B Q4_K_M · vulkan-nvidia: 42.6 tok/s generation, 989.4 tok/s prompt, load 7.2 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend vulkan, 20 layers on GPU, PARTIAL: the model does not fit in this card, the rest runs on the CPU)
- file: 4.8 GB, VRAM taken: 4520 MB
- prompt: 512 tokens in 0.52 s
- generation: 127 tokens, first after 621 ms, temperature 0
- median of 3 runs; generation 33.6 to 45.4 tok/s, prompt 610.9 to 1174.4 tok/s
- warm-up before measuring: 9691 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
