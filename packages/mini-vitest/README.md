# mini-vitest

A blazing fast test runner powered by Vite.

## Features

- Vite's transformer, resolver, and plugin system. Powered by [vite-node](https://github.com/antfu/vite-node).
- Jest Snapshot.
- Chai for assertions.
- Async suite / test.
- ESM friendly, top level await.

```ts
import { it, describe, expect, assert } from 'vitest'

describe('suite name', () => {
  it('foo', () => {
    assert.equal(Math.sqrt(4), 2)
  })

  it('bar', () => {
    expect(1 + 1).eq(2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})
```

```bash
$ npx vitest
```