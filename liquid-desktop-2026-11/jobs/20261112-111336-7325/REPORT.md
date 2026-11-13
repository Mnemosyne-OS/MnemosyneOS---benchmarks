# SmolLM3-3B Q4_K_M · vulkan-arc: 21.4 tok/s generation, 192.9 tok/s prompt, load 2.1 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1820 MB
- prompt: 4096 tokens in 21.23 s
- generation: 29 tokens, first after 419 ms, temperature 0
- median of 3 runs; generation 21 to 22.2 tok/s, prompt 190.6 to 196.9 tok/s
- warm-up before measuring: 4145 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
