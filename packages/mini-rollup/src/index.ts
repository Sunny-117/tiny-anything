import { Bundle } from './bundle'

export function build(config: tinyRollupConfig) {
  if (config) {
    const { entry, outputFileName } = config
    const bundle = new Bundle({ entry, outputFileName })
    bundle.build()
  }
  else {
    console.error('tiny-rollup config not found')
  }
}

export function tinyRollup(entry: string, outputFileName?: string): void {
  build({ entry, outputFileName })
}

export interface tinyRollupConfig {
  entry: string
  outputFileName?: string
}

export function defineConfig(config: tinyRollupConfig) {
  return config
}
