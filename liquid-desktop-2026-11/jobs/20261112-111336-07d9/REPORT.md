# Qwen3-4B Q4_K_M · vulkan-arc: 18.2 tok/s generation, 119.8 tok/s prompt, load 2.0 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2377 MB
- prompt: 4096 tokens in 34.19 s
- generation: 30 tokens, first after 511 ms, temperature 0
- median of 3 runs; generation 17.9 to 18.2 tok/s, prompt 117.8 to 121.2 tok/s
- warm-up before measuring: 2808 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
