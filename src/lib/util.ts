export function popRandom<A>(arr: A[]): A {
  let n = Math.random() * arr.length | 0;
  let x = arr[n];
  arr.splice(n, 1);
  return x;
}
