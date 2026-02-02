
const parse = (pattern) => {
  if (!pattern) {
    return {
      entire: '',
      segments: []
    }
  }
  return {
    entire: pattern,
    segments: pattern.split('.')
  }
}

export class Path {
  constructor(input = '') {
    const { entire, segments } = parse(input)
    this.entire = entire
    this.segments = segments
  }
  static parse() {
    return new Path()
  }
  concat(...args) {
    const path = new Path('')
    path.segments = this.segments.concat(...args)
    path.entire = path.segments.join('.')
    return path
  }
}