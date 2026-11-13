# router Qwen3-1.7B-npu · CPU: 61/140, 1093 ms per sentence, 3.81 CPU cores

- device: Intel(R) Core(TM) Ultra 7 155H (openvino-genai 2026.4.1.0-3408-ab01d1771e4)
- per language: fr 9/20, en 10/20, es 7/20, de 10/20, pt 8/20, ru 9/20, zh 8/20
- 8 answers named no label
- latency per sentence: median 1093 ms, p90 1300 ms
- this process used 3.81 CPU cores; machine CPU +23.8 %; NVIDIA 0.0 %
- reference: d1-2B 132/140 (RTX), 131/140 (CPU); not like for like, d1 gives a probability and the app acts above 0.8
- misses: fr #3 app -> task; fr #5 app -> None; fr #6 window -> app; fr #7 window -> app; fr #9 weather -> window; fr #15 remember -> task; fr #16 recall -> task; fr #17 chat -> task; fr #18 chat -> task; fr #19 chat -> task; fr #20 chat -> task; en #2 app -> None; en #6 window -> app; en #7 window -> None; en #9 weather -> task; en #15 remember -> None; en #16 recall -> task; en #17 chat -> task; en #18 chat -> task; en #19 chat -> task; en #20 chat -> task; es #2 app -> task; es #4 app -> task; es #6 window -> app; es #7 window -> app; es #8 weather -> task; es #9 weather -> window; es #10 weather -> task; es #15 remember -> task; es #16 recall -> task; es #17 chat -> task; es #18 chat -> app; es #19 chat -> task; es #20 chat -> task; de #2 app -> None; de #6 window -> app; de #7 window -> app; de #9 weather -> task; de #15 remember -> task; de #16 recall -> task
