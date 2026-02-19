const parse = (pattern: string) => {
  if (!pattern) {
    return {
      entire: '',
      segments: [] as string[]
    }
  }
  return {
    entire: pattern,
    segments: pattern.split('.')
  }
}

export class Path {
  entire: string
  segments: string[]

  constructor(input = '') {
    const { entire, segments } = parse(input)
    this.entire = entire
    this.segments = segments
  }
  static parse() {
    return new Path()
  }
  concat(...args: string[][]) {
    const path = new Path('')
    path.segments = this.segments.concat(...args)
    path.entire = path.segments.join('.')
    return path
  }
}