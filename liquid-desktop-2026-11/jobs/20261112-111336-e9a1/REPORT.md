# Qwen3-1.7B Q8_0 · vulkan-arc: 23.2 tok/s generation, 215.2 tok/s prompt, load 1.6 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1745 MB
- prompt: 4096 tokens in 19.03 s
- generation: 30 tokens, first after 389 ms, temperature 0
- median of 3 runs; generation 23.2 to 23.3 tok/s, prompt 212.5 to 215.5 tok/s
- warm-up before measuring: 2172 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
