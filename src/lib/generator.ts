import { delaunay } from "./delaunay";
import { type Edge, type Point } from "./geometry";
import { range, times } from "@gbagan/utils";
import { popRandom } from "./util";

type Output = {
  edges: Edge[],
  solution: Point[],
}

export function generateTriangulated(n: number): Output {
  const remaining = range(0, n);
  const solution = times(n, () => ({x: 0, y: 0}));
  
  const a = popRandom(remaining);
  const b = popRandom(remaining);
  const c = popRandom(remaining);
  solution[a] = {x: 0.05, y: 0.95};
  solution[b] = {x: 0.95, y: 0.95};
  solution[c] = {x : 0.5, y: 0.1};
  const faces = [[a, b, c]];
  while (remaining.length > 0) {
    const [u, v, w] = popRandom(faces);
    const t = popRandom(remaining);
    faces.push([u, v, t]);
    faces.push([u, w, t]);
    faces.push([v, w, t]);
    solution[t].x = (solution[u].x + solution[v].x + solution[w].x) / 3;
    solution[t].y = (solution[u].y + solution[v].y + solution[w].y) / 3;
  }
  const seen: Set<number> = new Set();
  const edges: [number, number][] = [];
  for (const [u, v, w] of faces) {
    for (const [x, y] of [[u, v], [v, w], [u, w]]) {
      if (!seen.has(x*n+y) && !seen.has(y*n+x)) {
        seen.add(x*n+y);
        edges.push([x, y]);
      }
    }
  }
  return { edges, solution }
}

export function generateDelaunay(n: number): Output {
  const threshold = n <= 10 ? 0.04 : 0.01; // todo
  const points: Point[] = [];
  while (points.length < n) {
    const p = {x: 0.05 + 0.9 * Math.random(), y: 0.05 + 0.9 * Math.random()}
    if (points.every(p2 => (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2 > threshold)) {
      points.push(p);
    }
  }
  return { edges: delaunay(points), solution: points };
}