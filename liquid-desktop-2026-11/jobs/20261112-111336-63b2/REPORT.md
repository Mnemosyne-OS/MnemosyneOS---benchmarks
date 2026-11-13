# LFM2.5-2.6B Q4_K_M · vulkan-arc: 23.3 tok/s generation, 365.2 tok/s prompt, load 1.9 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 4096 tokens in 11.22 s
- generation: 32 tokens, first after 340 ms, temperature 0
- median of 3 runs; generation 21.8 to 23.5 tok/s, prompt 359.6 to 367.3 tok/s
- warm-up before measuring: 2713 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
