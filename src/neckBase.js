import back from "./back";

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
    utils,
    store
  } = part.shorthand()

  const DOWN = -90;
  const UP = 90;
  const RIGHT = 0;
  const LEFT = 180;

  const { neck, chest, shoulderSlope } = measurements;
  const hbw = chest / 20;

  // Base neck measurements
  let backNeckDepth = hbw * 0.5;
  let frontNeckDepth = hbw * 2 - chest * 0.01;
  let neckWidth = hbw * 1.5;

  let target = neck / 2;
  let tweak = 1;
  let delta;

  points.origin = new Point(0, 0);

  do {
    backNeckDepth *= tweak;
    frontNeckDepth *= tweak;
    neckWidth *= tweak;

    points.n = points.origin.shift(DOWN, backNeckDepth);
    points.nCp = points.n.shift(RIGHT, hbw * 0.3);

    points.m = points.origin.shift(DOWN, frontNeckDepth);
    points.mCp = points.m.shift(RIGHT, hbw * 0.8);

    points.s = points.origin.shift(RIGHT, neckWidth);
    points.sCp = points.s.shift(DOWN - shoulderSlope, hbw * 0.3)

    paths.neck = new Path()
      .move(points.m)
      .curve(points.mCp, points.sCp, points.s)
      .curve(points.sCp, points.nCp, points.n)

    delta = paths.neck.length() - target;
    tweak = delta > 0 ? tweak * 0.99 : tweak * 1.01;
  } while (Math.abs(delta) > 1);

  store.set("frontNeckDepth", frontNeckDepth + chest * 0.01)
  store.set("backNeckDepth", backNeckDepth)
  store.set("neckWidth", neckWidth)

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
