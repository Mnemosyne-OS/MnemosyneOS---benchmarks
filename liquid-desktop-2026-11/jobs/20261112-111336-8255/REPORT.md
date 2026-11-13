# d1-2B Q4_K_M · cpu: 30.9 tok/s generation, 267.1 tok/s prompt, load 1.2 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.02 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 1.92 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 28.2 to 31.8 tok/s, prompt 259.5 to 293.8 tok/s
- warm-up before measuring: 5898 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
