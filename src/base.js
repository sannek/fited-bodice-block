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

  /*
  TODOS
  - calculate waist points ff and fb based on real waist measurement (account for waist > chest)
  - maybe use frontChest and frontWaist instead of just chest? -> better result with larger bust?
  */

  const BEAM = 100 // only used for making beams for easy reading
  const DOWN = -90;
  const UP = 90;
  const RIGHT = 0;
  const LEFT = 180;

  const { chest, waist, hpsToWaistFront, hpsToWaistBack, shoulderSlope, shoulderToShoulder } = measurements;
  const { chestEase, waistEase } = options;

  const frontNeckDepth = store.get("frontNeckDepth");
  const backNeckDepth = store.get("backNeckDepth");
  const neckWidth = store.get("neckWidth");

  const chestEaseFactor = 1 + chestEase;
  const waistEaseFactor = 1 + waistEase;

  const hbw = chest / 20;
  const finalChest = chest * chestEaseFactor;
  const frontChest = finalChest / 4 + hbw / 2
  const finalWaist = waist * waistEaseFactor;

  points.origin = new Point(0, 0);

  // chest line
  points.a = points.origin.shift(DOWN, hpsToWaistFront / 2);
  points.c = points.a.shift(RIGHT, frontChest);
  points.b = points.a.shift(RIGHT, finalChest / 2);
  points.cBeam = points.c.shift(UP, BEAM);

  // front key points
  points.m1 = points.a.shift(UP, (hpsToWaistFront - frontNeckDepth) / 2);
  points.m = points.m1.shift(RIGHT, hbw / 2);

  const frontAngle = 90 - points.a.angle(points.m);

  points.d = points.m.shift(DOWN - frontAngle, hpsToWaistFront - frontNeckDepth);
  points.ff = points.d.shift(RIGHT - frontAngle, frontChest - 0.5 * hbw);
  points.m2 = points.m.shift(UP - frontAngle, frontNeckDepth);
  points.sf = points.m2.shift(RIGHT - frontAngle, neckWidth);
  points.sfBeam = points.sf.shift(RIGHT - shoulderSlope - frontAngle, BEAM);

  points.s0f = utils.beamsIntersect(points.c, points.cBeam, points.m2, points.sf);
  points.t0f = utils.beamsIntersect(points.c, points.cBeam, points.sf, points.sfBeam);

  // back key points
  const difference = (hpsToWaistBack - backNeckDepth) - (hpsToWaistFront - frontNeckDepth);
  const addToBackWaistHeight = difference * chest * 0.0005;

  points.n = points.b.shift(UP, (hpsToWaistFront - backNeckDepth) / 2 + addToBackWaistHeight);
  points.n1 = points.n.shift(UP, backNeckDepth);
  points.sb = points.n1.shift(LEFT, neckWidth);
  points.sbBeam = points.sb.shift(LEFT + shoulderSlope, BEAM);

  points.e = points.n.shift(DOWN, hpsToWaistBack - backNeckDepth);
  points.fb = points.e.shift(LEFT, finalChest / 2 - frontChest - 0.5 * hbw);
  points.s0b = utils.beamsIntersect(points.c, points.cBeam, points.n1, points.sb);
  points.t0b = utils.beamsIntersect(points.c, points.cBeam, points.sb, points.sbBeam);

  // finalize back shoulder
  points.t00b = points.n.shift(LEFT, shoulderToShoulder / 2);
  points.t00bBeam = points.t00b.shift(DOWN, BEAM);

  points.tb = utils.beamsIntersect(points.sb, points.sbBeam, points.t00b, points.t00bBeam);

  // finalize front shoulder
  const backShoulderWidth = points.tb.dist(points.sb);

  // front shoulder is approx 1cm narrower than back shoulder
  points.tf = points.sf.shiftTowards(points.t0f, backShoulderWidth - chest * 0.01)


  // calculate armhole depth - use highest shoulder help point
  if (points.t0b.y < points.t0f.y) {
    points.x0 = points.t0b.shift(DOWN, (hpsToWaistBack - backNeckDepth) / 3);
  } else {
    points.x0 = points.t0f.shift(DOWN, (hpsToWaistBack - backNeckDepth) / 3);
  }

  points.x = points.x0.shift(DOWN, hbw * 1.5 * chestEaseFactor);

  paths.chestLine = new Path()
    .move(points.a)
    .line(points.c)
    .line(points.b)

  paths.frontBase = new Path()
    .move(points.tf)
    .line(points.sf)
    .line(points.m)
    .line(points.d)
    .line(points.ff)
    .line(points.x)

  paths.backBase = new Path()
    .move(points.tb)
    .line(points.sb)
    .line(points.n1)
    .line(points.e)
    .line(points.fb)
    .line(points.x)

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
