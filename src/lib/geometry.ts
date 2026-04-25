export type Point = {x: number, y: number};
export type Edge = [number, number];

const EPS = 1e-9;

export function lineIntersection(a: Point, b: Point, c: Point, d: Point): Point {
    const x1 = a.x, y1 = a.y;
    const x2 = b.x, y2 = b.y;
    const x3 = c.x, y3 = c.y;
    const x4 = d.x, y4 = d.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    const px = ((x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4)) / denom;
    const py = ((x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4)) / denom;

    return { x: px, y: py };
}


function orientation(p: Point, q: Point, r: Point) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (Math.abs(val) < EPS) return 0;
  return val > 0 ? 1 : 2;
}

function onSegment(p: Point, q: Point, r: Point) {
  return (
    Math.min(p.x, r.x) <= q.x && q.x <= Math.max(p.x, r.x) &&
    Math.min(p.y, r.y) <= q.y && q.y <= Math.max(p.y, r.y)
  );
}

export function segmentsIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {
  if (p1.x === p2.x && p1.y === p2.y
    || p1.x === q2.x && p1.y === q2.y
    || q1.x === p2.x && q1.y === p2.y
    || q1.x === q2.x && q1.y === q2.y
  ) {
    return false;
  }  
  
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  return (
    o1 !== o2 && o3 !== o4
    || o1 === 0 && onSegment(p1, p2, q1)
    || o2 === 0 && onSegment(p1, q2, q1)
    || o3 === 0 && onSegment(p2, p1, q2)
    || o4 === 0 && onSegment(p2, q1, q2)
  )
}