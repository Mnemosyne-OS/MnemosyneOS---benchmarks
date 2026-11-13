# d1-2B Q4_K_M · vulkan-arc: 29.1 tok/s generation, 520.9 tok/s prompt, load 2.2 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 4096 tokens in 7.86 s
- generation: 32 tokens, first after 173 ms, temperature 0
- median of 3 runs; generation 28.8 to 29.4 tok/s, prompt 511.2 to 540 tok/s
- warm-up before measuring: 420 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
