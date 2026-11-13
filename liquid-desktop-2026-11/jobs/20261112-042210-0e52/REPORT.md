# LFM3-1.7B Q4_K_M · vulkan-arc: 30.8 tok/s generation, 420.3 tok/s prompt, load 2.5 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 9.75 s
- generation: 32 tokens, first after 175 ms, temperature 0
- median of 3 runs; generation 29.2 to 32.3 tok/s, prompt 385 to 431.4 tok/s
- warm-up before measuring: 500 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
