# Qwen3-4B Q4_K_M · vulkan-arc: 16.4 tok/s generation, 244 tok/s prompt, load 2.2 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 37 layers on GPU)
- file: 2.33 GB, VRAM taken: 2377 MB
- prompt: 512 tokens in 2.10 s
- generation: 126 tokens, first after 513 ms, temperature 0
- median of 3 runs; generation 16.2 to 16.5 tok/s, prompt 242.2 to 245.5 tok/s
- warm-up before measuring: 8566 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
