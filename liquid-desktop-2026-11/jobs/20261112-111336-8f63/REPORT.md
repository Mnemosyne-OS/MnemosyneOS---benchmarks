# Qwen3.5-4B Q4_K_M · cuda: 35.3 tok/s generation, 1941.9 tok/s prompt, load 4.0 s

- device: NVIDIA GeForce RTX 4050 Laptop GPU (backend cuda, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2604 MB
- prompt: 512 tokens in 0.26 s
- generation: 128 tokens, first after 88 ms, temperature 0
- median of 3 runs; generation 35.2 to 35.3 tok/s, prompt 1921.8 to 1981.4 tok/s
- warm-up before measuring: 4093 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
