# Qwen3.5-4B Q4_K_M · vulkan-arc: 14.8 tok/s generation, 173.7 tok/s prompt, load 3.0 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2605 MB
- prompt: 4096 tokens in 23.58 s
- generation: 32 tokens, first after 1009 ms, temperature 0
- median of 3 runs; generation 14.8 to 14.9 tok/s, prompt 173.5 to 174.3 tok/s
- warm-up before measuring: 3779 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 8192
