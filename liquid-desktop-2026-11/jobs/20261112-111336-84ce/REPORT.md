# LFM2-2.6B Q4_K_M · cpu: 24.8 tok/s generation, 167.2 tok/s prompt, load 1.2 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.46 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 3.06 s
- generation: 128 tokens, first after 560 ms, temperature 0
- median of 3 runs; generation 23.4 to 26.5 tok/s, prompt 166 to 168 tok/s
- warm-up before measuring: 6707 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
