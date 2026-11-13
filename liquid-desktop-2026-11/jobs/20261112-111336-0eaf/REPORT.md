# d1-2B Q4_K_M · vulkan-arc: 23.9 tok/s generation, 625.1 tok/s prompt, load 1.4 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 6.55 s
- generation: 32 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 23.8 to 24.6 tok/s, prompt 592.2 to 637.4 tok/s
- warm-up before measuring: 2677 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
