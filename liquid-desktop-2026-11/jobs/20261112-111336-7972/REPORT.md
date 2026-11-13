# d1-3B Q4_K_M · cpu: 25.7 tok/s generation, 157.7 tok/s prompt, load 1.7 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.56 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 3.25 s
- generation: 128 tokens, first after 668 ms, temperature 0
- median of 3 runs; generation 22.7 to 26.2 tok/s, prompt 149.4 to 159.9 tok/s
- warm-up before measuring: 7199 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
