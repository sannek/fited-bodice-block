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
  const LEFT = 180;
  const RIGHT = -180;

  const { chest, hpsToWaistFront, hpsToWaistBack, waist, shoulderToShoulder, shoulderSlope } = measurements;

  const hbw = chest / 20;
  const backChest = chest / 4 - (chest * 0.02);

  points.origin = new Point(0, 0)

  points.s = points.origin.shift(LEFT, hbw + chest * 0.03);
  points.sCp = points.s.shift(shoulderSlope - 90, hbw / 3);

  points.s1 = points.origin.shift(LEFT, shoulderToShoulder / 2);
  points.tCalc = points.s.shift(180 + shoulderSlope, shoulderToShoulder);
  points.s1calc = points.s1.shift(DOWN, hpsToWaistFront);

  points.t0 = points.s1.shift(DOWN, hbw);

  points.n = points.origin.shift(DOWN, hpsToWaistBack * 0.05);
  points.nCp = points.n.shift(LEFT, hbw / 3);
  points.r = points.n.shift(DOWN, hpsToWaistBack / 5);
  points.q = points.r.shift(LEFT, shoulderToShoulder / 2);

  points.b = points.n.shift(DOWN, hpsToWaistBack / 2);
  points.c = points.b.shift(LEFT, backChest);
  points.e = points.n.shift(DOWN, hpsToWaistBack);
  points.f = points.e.shift(LEFT, backChest - 30);

  paths.back = new Path()
    .move(points.f)
    .line(points.e)
    .line(points.n)
    .curve(points.nCp, points.sCp, points.s)
    .line(points.t0)
    .line(points.c)
    .close()

  // Complete?
  if (complete) {
    if (sa) {
    }
  }

  // Paperless?
  if (paperless) {
    macro('hd', {
      from: points.bottomLeft,
      to: points.bottomRight,
      y: points.bottomLeft.y + sa + 15
    })
    macro('vd', {
      from: points.bottomRight,
      to: points.topRight,
      x: points.topRight.x + sa + 15
    })
  }

  return part
}
