# router Qwen3-1.7B-npu · GPU.0: 64/140, 474 ms per sentence, 0.98 CPU cores

- device: Intel(R) Arc(TM) Graphics (iGPU) (openvino-genai 2026.4.1.0-3408-ab01d1771e4)
- per language: fr 9/20, en 10/20, es 6/20, de 9/20, pt 9/20, ru 11/20, zh 10/20
- 3 answers named no label
- latency per sentence: median 474 ms, p90 490 ms
- this process used 0.98 CPU cores; machine CPU +-8.8 %; NVIDIA 0.0 %
- reference: d1-2B 132/140 (RTX), 131/140 (CPU); not like for like, d1 gives a probability and the app acts above 0.8
- misses: fr #2 app -> task; fr #3 app -> task; fr #6 window -> app; fr #7 window -> app; fr #9 weather -> window; fr #15 remember -> None; fr #16 recall -> task; fr #17 chat -> window; fr #18 chat -> app; fr #19 chat -> task; fr #20 chat -> task; en #2 app -> task; en #4 app -> window; en #6 window -> app; en #7 window -> None; en #9 weather -> task; en #16 recall -> task; en #17 chat -> task; en #18 chat -> task; en #19 chat -> task; en #20 chat -> task; es #2 app -> window; es #3 app -> window; es #4 app -> task; es #6 window -> app; es #7 window -> app; es #8 weather -> task; es #9 weather -> window; es #10 weather -> task; es #15 remember -> task; es #16 recall -> task; es #17 chat -> task; es #18 chat -> app; es #19 chat -> window; es #20 chat -> task; de #4 app -> window; de #5 app -> task; de #6 window -> app; de #7 window -> app; de #9 weather -> task
