export type Point = {x: number, y: number};
export type Edge = [number, number];

const orientation = (p: Point, q: Point, r: Point) =>
  Math.sign((q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y));

const onSegment = (p: Point, q: Point, r: Point) =>
  Math.min(p.x, r.x) <= q.x && q.x <= Math.max(p.x, r.x)
  && Math.min(p.y, r.y) <= q.y && q.y <= Math.max(p.y, r.y);

export function segmentsIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {
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