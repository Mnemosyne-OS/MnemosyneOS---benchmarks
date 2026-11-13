# router LFM2.5-1.2B · NPU: 79/140, 891 ms per sentence, 0.04 CPU cores

- device: Intel(R) AI Boost (openvino-genai 2026.4.1.0-3408-ab01d1771e4)
- per language: fr 12/20, en 13/20, es 10/20, de 11/20, pt 10/20, ru 12/20, zh 11/20
- 0 answers named no label
- latency per sentence: median 891 ms, p90 966 ms
- this process used 0.04 CPU cores; machine CPU +10.9 %; NVIDIA 32.3 %
- reference: d1-2B 132/140 (RTX), 131/140 (CPU); not like for like, d1 gives a probability and the app acts above 0.8
- misses: fr #6 window -> app; fr #7 window -> app; fr #9 weather -> app; fr #16 recall -> app; fr #17 chat -> app; fr #18 chat -> app; fr #19 chat -> remember; fr #20 chat -> app; en #6 window -> app; en #7 window -> app; en #16 recall -> remember; en #17 chat -> app; en #18 chat -> app; en #19 chat -> remember; en #20 chat -> app; es #6 window -> app; es #7 window -> app; es #8 weather -> app; es #9 weather -> app; es #10 weather -> agenda; es #16 recall -> app; es #17 chat -> app; es #18 chat -> app; es #19 chat -> remember; es #20 chat -> app; de #6 window -> app; de #7 window -> app; de #9 weather -> remember; de #11 task -> app; de #16 recall -> remember; de #17 chat -> app; de #18 chat -> app; de #19 chat -> remember; de #20 chat -> app; pt #5 app -> remember; pt #6 window -> app; pt #7 window -> app; pt #9 weather -> app; pt #10 weather -> app; pt #16 recall -> app
