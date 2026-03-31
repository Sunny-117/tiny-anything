export const isArrayLike = (x) => {
  return x && typeof x.length === "number" && typeof x !== "function";
};
