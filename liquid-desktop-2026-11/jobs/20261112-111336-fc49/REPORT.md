# SmolLM3-3B Q4_K_M · cpu: 16.9 tok/s generation, 132.6 tok/s prompt, load 1.7 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.78 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 3.86 s
- generation: 125 tokens, first after 1116 ms, temperature 0
- median of 3 runs; generation 15.5 to 18.8 tok/s, prompt 120.1 to 133.5 tok/s
- warm-up before measuring: 10695 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
