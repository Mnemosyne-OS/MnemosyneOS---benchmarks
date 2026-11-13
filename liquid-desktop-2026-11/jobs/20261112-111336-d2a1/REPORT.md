# LFM2.5-2.6B Q4_K_M · cpu: 23.2 tok/s generation, 165.8 tok/s prompt, load 1.8 s

- device: cpu (backend cpu, 0 layers on GPU)
- file: 1.56 GB, VRAM taken: 0 MB
- prompt: 512 tokens in 3.09 s
- generation: 128 tokens, first after 648 ms, temperature 0
- median of 3 runs; generation 19.9 to 25.5 tok/s, prompt 157.1 to 170.4 tok/s
- warm-up before measuring: 7445 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
