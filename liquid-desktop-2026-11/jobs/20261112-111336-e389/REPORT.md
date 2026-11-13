# Qwen3.5-4B Q4_K_M · vulkan-arc: 16.1 tok/s generation, 204.3 tok/s prompt, load 4.7 s

- device: Intel(R) Arc(TM) Graphics (backend vulkan, 33 layers on GPU)
- file: 2.55 GB, VRAM taken: 2605 MB
- prompt: 512 tokens in 2.51 s
- generation: 128 tokens, first after 1018 ms, temperature 0
- median of 3 runs; generation 15.9 to 16.1 tok/s, prompt 204.1 to 205 tok/s
- warm-up before measuring: 9625 ms (64 prompt tokens, 8 generated)
- measured with node-llama-cpp 3.22.3, context 4096
