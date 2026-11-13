# SmolLM3-3B Q4_K_M · vulkan-arc: 23.5 tok/s generation, 323.1 tok/s prompt, load 2.2 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 37 layers on GPU)
- file: 1.78 GB, VRAM taken: 1820 MB
- prompt: 512 tokens in 1.58 s
- generation: 125 tokens, first after 409 ms, temperature 0
- median of 3 runs; generation 23.4 to 23.6 tok/s, prompt 321.7 to 324 tok/s
- warm-up before measuring: 8306 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
