import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 不使用 DOM 环境，在需要时使用 mock
  },
});
