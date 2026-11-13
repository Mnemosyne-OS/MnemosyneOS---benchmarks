# Qwen3-1.7B Q8_0 · cuda: 60.1 tok/s generation, 4131.3 tok/s prompt, load 2.1 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1744 MB
- prompt: 512 tokens in 0.12 s
- generation: 126 tokens, first after 27 ms, temperature 0
- median of 3 runs; generation 59.9 to 60.2 tok/s, prompt 3982.7 to 5600.4 tok/s
- warm-up before measuring: 2491 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
