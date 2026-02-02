type Func<T extends any[], R> = (...args: T) => R;

function partial<T extends any[], R>(
  func: Func<T, R>,
  ...partialArgs: T
): Func<T, R> {
  return function (...args: T) {
    const fullArgs = partialArgs.concat(args);
    return func.apply(this, fullArgs);
  };
}

export default partial;
