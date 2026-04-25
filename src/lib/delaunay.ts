import type { Point } from "./geometry";
import { range } from "./util";

type Triangle = [number, number, number]

// Orientation (aire signée)
function orient(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// Test du cercle circonscrit
function inCircle(a: Point, b: Point, c: Point, p: Point) {
  const ax = a.x - p.x;
  const ay = a.y - p.y;
  const bx = b.x - p.x;
  const by = b.y - p.y;
  const cx = c.x - p.x;
  const cy = c.y - p.y;

  const det =
    (ax * ax + ay * ay) * (bx * cy - cx * by) -
    (bx * bx + by * by) * (ax * cy - cx * ay) +
    (cx * cx + cy * cy) * (ax * by - bx * ay);

  return det > 0;
}

const edgeKey = (a: number, b: number) => a < b ? `${a},${b}` : `${b},${a}`;

export function delaunay(points: Point[]): [number, number][] {
  if (points.length < 3) return [];

  const n = points.length;

  const orientedTriangle = (i1: number, i2: number, i3: number): Triangle =>
    orient(points[i1], points[i2], points[i3]) < 0 ? [i3, i2, i1] : [i1, i2, i3];

  // Super triangle robuste
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  const dx = maxX - minX;
  const dy = maxY - minY;
  const delta = Math.max(dx, dy) * 100;

  const p1 = {x: -2, y: -1 };
  const p2 = {x: 0.5, y: 2 };
  const p3 = {x: 3, y: -1 };

  points = [...points, p1, p2, p3];

  let triangles: [number, number, number][] = [orientedTriangle(n, n+1, n+2)];

  // Shuffle (important pour stabilité)
  // todo a changer
  //points = points.sort(() => Math.random() - 0.5);

  points.forEach((point, i) => {
    const bad = triangles.filter(([i1, i2, i3]) => inCircle(points[i1], points[i2], points[i3], point));

    // Frontière du trou via hash
    const edgeMap = new Map<string, [number, number]>();

    for (const [i1, i2, i3] of bad) {
      for (const [a, b] of [[i1, i2], [i2, i3], [i3, i1]]) {
        const key = edgeKey(a, b);
        if (edgeMap.has(key)) {
          edgeMap.delete(key);
        } else {
          edgeMap.set(key, [a, b]);
        }
      }
    }

    triangles = triangles.filter(t => !bad.includes(t));

    for (const [i1, i2] of edgeMap.values()) {
      triangles.push(orientedTriangle(i1, i2, i));
    }
  })

  /*
  // Nettoyage du super triangle
  triangles = triangles.filter(t =>
    !t.hasVertex(p1) &&
    !t.hasVertex(p2) &&
    !t.hasVertex(p3)
  );
  */

  const edges: [number, number][] = [];
  const seen = new Set();
  for (const [i1, i2, i3] of triangles) {
    for (const [i, j] of [[i1, i2], [i2, i3], [i3, i1]]) {
      if (i < n && j < n && !seen.has(edgeKey(i, j))) {
        seen.add(edgeKey(i, j));
        edges.push([i, j]);
      }
    }
  }
  return edges;
}