# Qwen3-4B Q4_K_M · cuda: 38.8 tok/s generation, 2049.2 tok/s prompt, load 2.3 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2376 MB
- prompt: 512 tokens in 0.25 s
- generation: 126 tokens, first after 44 ms, temperature 0
- median of 3 runs; generation 38.7 to 39.3 tok/s, prompt 2028.6 to 2068.3 tok/s
- warm-up before measuring: 3713 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
