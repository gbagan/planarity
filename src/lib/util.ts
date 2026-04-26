export const tabulate = <A>(n: number, f: (i: number) => A): A[] => Array.from({ length: n }, (_, i) => f(i));

export function range(start: number, end: number, step?: number): number[] {
  const res = [];
  step = step ?? 1;
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      res.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      res.push(i);
    }
  }
  return res
}

export function popRandom<A>(arr: A[]): A {
  let n = Math.random() * arr.length | 0;
  let x = arr[n];
  arr.splice(n, 1);
  return x;
}

export function partition<A>(xs: A[], f: (x: A) => boolean): [A[], A[]] {
  const yes: A[] = [];
  const no: A[] = [];
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    if (f(x)) { yes.push(x) } else  { no.push(x) };
  }
  return [yes, no];
}
