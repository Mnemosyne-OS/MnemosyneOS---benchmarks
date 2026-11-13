# LFM3-1.7B Q4_K_M · cpu: 30.4 tok/s generation, 291.6 tok/s prompt, load 1.1 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.02 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 1.76 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 30 to 32.7 tok/s, prompt 274.9 to 303.6 tok/s
- warm-up before measuring: 5866 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
