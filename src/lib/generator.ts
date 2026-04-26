import { delaunay } from "./delaunay";
import { type Edge, type Point } from "./geometry";
import { popRandom, range, tabulate } from "./util";

type Output = {
  edges: Edge[],
  solution: Point[],
}

/*
export function generate_tantalo(n: number): [number, number][] {
  const index: Map<string, number> = new Map();
  let k = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i+1; j < n; j++) {
      index.set(`${i},${j}`, k);
      index.set(`${j},${i}`, k);
      k++;
    }
  }
  const lines: [Point, Point][] = [];
  const slopes: Set<number> = new Set();

  while (lines.length < n) {
    const u = { x: Math.random(), y: Math.random() };
    const v = { x: Math.random(), y: Math.random() };
    if (u.x === v.x) {
      continue;
    } 
    const slope = (v.y - u.y) / (v.x - u.x);
    if (!slopes.has(slope)) {
      slopes.add(slope);
      lines.push([u, v]);
    }
  } 

  const edges: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    const [a, b] = lines[i];
    const intersections: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        continue
      }
      const [c, d] = lines[j];
      const intersectionX = lineIntersection(a, b, c, d).x;
      intersections.push([intersectionX, j]);
    }
    intersections.sort((i1, i2) => i1[0] - i2[0]);

    for (let k = 0; k < intersections.length-1; k++) {
      const u = index.get(`${i},${intersections[k][1]}`)!;
      const v = index.get(`${i},${intersections[k+1][1]}`)!;
      edges.push([u, v]);
    }
  }

  return edges;
}
*/

export function generateTriangulated(n: number): Output {
  const remaining = range(0, n);
  const solution = tabulate(n, () => ({x: 0, y: 0}));
  
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