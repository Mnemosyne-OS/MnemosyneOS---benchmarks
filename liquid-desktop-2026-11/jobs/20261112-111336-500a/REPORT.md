# d1-3B Q4_K_M · vulkan-arc: 28.3 tok/s generation, 401 tok/s prompt, load 1.6 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 31 layers on GPU)
- file: 1.56 GB, VRAM taken: 1590 MB
- prompt: 512 tokens in 1.28 s
- generation: 128 tokens, first after 334 ms, temperature 0
- median of 3 runs; generation 27.8 to 28.3 tok/s, prompt 399.3 to 405.5 tok/s
- warm-up before measuring: 5630 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
