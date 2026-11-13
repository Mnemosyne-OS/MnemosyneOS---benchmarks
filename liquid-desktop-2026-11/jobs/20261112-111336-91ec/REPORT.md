# d1-3B Q4_K_M · vulkan-arc: 28.9 tok/s generation, 375.4 tok/s prompt, load 1.6 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 4096 tokens in 10.91 s
- generation: 32 tokens, first after 330 ms, temperature 0
- median of 3 runs; generation 28.9 to 29.2 tok/s, prompt 374.5 to 378 tok/s
- warm-up before measuring: 2003 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
