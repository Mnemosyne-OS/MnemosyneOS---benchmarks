# Qwen3-1.7B Q8_0 · vulkan-arc: 24 tok/s generation, 331.8 tok/s prompt, load 2.5 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 29 layers on GPU)
- file: 1.71 GB, VRAM taken: 1745 MB
- prompt: 512 tokens in 1.54 s
- generation: 126 tokens, first after 393 ms, temperature 0
- median of 3 runs; generation 23.9 to 24 tok/s, prompt 329.6 to 331.9 tok/s
- warm-up before measuring: 6981 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
