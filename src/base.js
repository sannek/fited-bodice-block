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
    options,
    utils
  } = part.shorthand()

  const DOWN = -90;
  const UP = 90;
  const LEFT = 180;
  const RIGHT = 0;

  const { chest, hpsToWaistFront } = measurements;
  const { chestEase } = options;

  const frontNeckDepth = 2 * hbw; // fix this to be more accurate for large/small sizes
  const fulLChest = chest * (100 * chestEase);
  const hbw = chest / 20;

  points.origin = new Point(0, 0);

  points.a = points.origin.shift(DOWN, hpsToWaistFront / 2);
  points.c = points.a.shift(RIGHT, fullChest / 2 + hbw / 2);
  points.b = points.a.shift(RIGHT, fullChest / 2);

  points.m1 = points.a.shift(UP, (hpsToWaistFront - frontNeckDepth) / 2);
  points.m = points.m1.shift(RIGHT, hbw / 2);

  console.log(points);
  const frontAngle = points.a.angle(points.m)

  paths.chestLine = new Path()
    .move(points.a)
    .line(points.c)
    .line(points.b)

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
