# d1-2B Q4_K_M · vulkan-arc: 28.4 tok/s generation, 629 tok/s prompt, load 1.3 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 25 layers on GPU)
- file: 1.02 GB, VRAM taken: 1042 MB
- prompt: 512 tokens in 0.81 s
- generation: 128 tokens, first after 1 ms, temperature 0
- median of 3 runs; generation 28.4 to 28.8 tok/s, prompt 600.7 to 634.9 tok/s
- warm-up before measuring: 5612 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
