export default function (part) {
  let {
    options,
    Point,
    Path,
    points,
    paths,
    Snippet,
    snippets,
    complete,
    sa,
    paperless,
    macro,
    measurements,
    utils
  } = part.shorthand()

  const DOWN = -90;
  const UP = 90;
  const RIGHT = 0;
  const LEFT = 180;

  const { chest, hpsToWaistFront, hpsToWaistBack } = measurements;
  const { chestEase } = options;
  const chestEaseFactor = (100 + chestEase) / 100;

  const hbw = chest / 20;
  const frontNeckDepth = 2 * hbw; // fix this to be more accurate for large/small sizes
  const backNeckDepth = 0.5 * hbw; // fix this to be more accurate for large/small sizes
  const neckWidth = 1.5 * hbw;
  const fullChest = chest * chestEaseFactor;
  const frontChest = fullChest / 4 + hbw / 2

  points.origin = new Point(0, 0);

  // chest line
  points.a = points.origin.shift(DOWN, hpsToWaistFront / 2);
  points.c = points.a.shift(RIGHT, frontChest);
  points.b = points.a.shift(RIGHT, fullChest / 2);
  points.cUp = points.c.shift(UP, 100) // only used for calculating shoulder points

  // front key points
  points.m1 = points.a.shift(UP, (hpsToWaistFront - frontNeckDepth) / 2);
  points.m = points.m1.shift(RIGHT, hbw / 2);

  const frontAngle = 90 - points.a.angle(points.m);

  points.d = points.m.shift(DOWN - frontAngle, hpsToWaistFront - frontNeckDepth)
  points.ff = points.d.shift(RIGHT - frontAngle, frontChest - 0.5 * hbw)
  points.m2 = points.m.shift(UP - frontAngle, frontNeckDepth)
  points.sf = points.m2.shift(RIGHT - frontAngle, neckWidth);
  points.s0f = utils.beamsIntersect(points.c, points.cUp, points.m2, points.sf)


  // back key points
  const difference = (hpsToWaistBack - backNeckDepth) - (hpsToWaistFront - frontNeckDepth)
  const addToBackWaistHeight = difference * chest * 0.0005;

  points.n = points.b.shift(UP, (hpsToWaistFront - backNeckDepth) / 2 + addToBackWaistHeight);
  points.n1 = points.n.shift(UP, backNeckDepth)
  points.sb = points.n1.shift(LEFT, neckWidth)
  points.e = points.n.shift(DOWN, hpsToWaistBack - backNeckDepth);
  points.fb = points.e.shift(LEFT, fullChest / 2 - frontChest - 0.5 * hbw)
  points.s0b = utils.beamsIntersect(points.c, points.cUp, points.n1, points.sb)

  paths.chestLine = new Path()
    .move(points.a)
    .line(points.c)
    .line(points.b)

  paths.frontBase = new Path()
    .move(points.s0f)
    .line(points.sf)
    .line(points.m)
    .line(points.d)
    .line(points.ff)

  paths.backBase = new Path()
    .move(points.s0b)
    .line(points.n1)
    .line(points.e)
    .line(points.fb)

  // Complete?
  if (complete) {
    if (sa) {
    }
  }

  // Paperless?
  if (paperless) {
  }

  return part
}
