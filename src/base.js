import { RIGHT, LEFT, UP, DOWN, CM_FACTOR } from './constants';

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

  const BEAM = 100 // only used for making beams for easy reading

  const { chest, waist, highBust, waistBack, hpsToWaistFront, hpsToWaistBack, shoulderSlope, shoulderToShoulder } = measurements;
  const { chestEase, waistEase } = options;
  const frontNeckDepth = store.get("frontNeckDepth");
  const backNeckDepth = store.get("backNeckDepth");
  const neckWidth = store.get("neckWidth");

  const chestEaseFactor = 1 + chestEase;
  const waistEaseFactor = 1 + waistEase;

  const CM = chest * CM_FACTOR;
  const HBW = chest / 20;

  const cupSize = (chest - highBust)
  const largeCup = cupSize > 7 * CM;
  const veryLargeCup = cupSize > 15 * CM;
  store.set("largeCup", largeCup);
  store.set("veryLargeCup", veryLargeCup);

  // set up measurements already for half pattern
  const finalChest = 0.5 * chest * chestEaseFactor;
  let finalFrontChest = 0.5 * finalChest + 2 * CM;
  finalFrontChest += veryLargeCup ? + 2 * CM : 0;
  const finalBackChest = finalChest - finalFrontChest;
  const finalWaist = 0.5 * waist * waistEaseFactor;

  points.origin = new Point(0, 0);

  // chest line
  points.a = points.origin.shift(DOWN, hpsToWaistFront / 2);
  points.b = points.a.shift(RIGHT, finalChest);
  points.c = points.a.shift(RIGHT, finalFrontChest);
  points.cBeam = points.c.shift(UP, BEAM);

  // BODICE BACK POINTS
  const lengthDiff = (hpsToWaistBack - backNeckDepth) - (hpsToWaistFront - frontNeckDepth);
  const addToBackWaistHeight = lengthDiff * chest * 0.0005;

  const finalBackWaist = 0.5 * waistBack * waistEaseFactor;
  store.set("finalBackWaist", finalBackWaist)
  const backWaistDiff = finalBackChest - finalBackWaist;
  let backWaist;

  if (backWaistDiff <= HBW * 0.5) {
    backWaist = finalBackWaist;
  } else {
    backWaist = finalBackChest - backWaistDiff / 2
  }

  points.centerBackNeck = points.b.shift(UP, (hpsToWaistFront - backNeckDepth) / 2 + addToBackWaistHeight);
  points.n1 = points.centerBackNeck.shift(UP, backNeckDepth);
  points.hpsBack = points.n1.shift(LEFT, neckWidth);
  points.sbBeam = points.hpsBack.shift(LEFT + shoulderSlope, BEAM);

  points.centerBackWaist = points.centerBackNeck.shift(DOWN, hpsToWaistBack - backNeckDepth);
  points.sideBackWaist = points.centerBackWaist.shift(LEFT, backWaist);
  points.s0b = utils.beamsIntersect(points.c, points.cBeam, points.n1, points.hpsBack);
  points.t0b = utils.beamsIntersect(points.c, points.cBeam, points.hpsBack, points.sbBeam);

  // finalize back shoulder
  points.t00b = points.centerBackNeck.shift(LEFT, shoulderToShoulder / 2 - CM);
  points.t00bBeam = points.t00b.shift(DOWN, BEAM);

  points.shoulderBack = utils.beamsIntersect(points.hpsBack, points.sbBeam, points.t00b, points.t00bBeam);
  const backShoulderWidth = points.shoulderBack.dist(points.hpsBack);

  // BODICE FRONT POINTS
  const finalFrontWaist = finalWaist - finalBackWaist;
  store.set("finalFrontWaist", finalFrontWaist);
  const frontWaistDiff = finalFrontChest - finalFrontWaist;
  let frontWaist;

  let centerFrontSlant;
  if (largeCup) {
    centerFrontSlant = HBW - 2 * CM;
  } else {
    centerFrontSlant = Math.min(3 * CM, HBW - 2 * CM);
  }


  if (frontWaistDiff <= HBW * 0.8) {
    frontWaist = finalFrontWaist;
  } else {
    frontWaist = finalFrontChest - frontWaistDiff / 2
  }
  points.m1 = points.a.shift(UP, (hpsToWaistFront - frontNeckDepth) / 2);
  points.centerFrontNeck = points.m1.shift(RIGHT, centerFrontSlant);

  const frontAngle = 90 - points.a.angle(points.centerFrontNeck);
  store.set("frontAngle", frontAngle);

  points.centerFrontWaist = points.centerFrontNeck.shift(DOWN - frontAngle, hpsToWaistFront - frontNeckDepth);
  points.sideFrontWaist = points.centerFrontWaist.shift(RIGHT - frontAngle, frontWaist);
  points.m2 = points.centerFrontNeck.shift(UP - frontAngle, frontNeckDepth);
  points.hpsFront = points.m2.shift(RIGHT - frontAngle, neckWidth);
  points.sfBeam = points.hpsFront.shift(RIGHT - shoulderSlope - frontAngle, BEAM);

  points.s0f = utils.beamsIntersect(points.c, points.cBeam, points.m2, points.hpsFront);
  points.t0f = utils.beamsIntersect(points.c, points.cBeam, points.hpsFront, points.sfBeam);

  // front shoulder is approx 1cm narrower than back shoulder
  points.shoulderFront = points.hpsFront.shiftTowards(points.t0f, backShoulderWidth - CM)


  // calculate armhole depth - use highest shoulder help point
  if (points.t0b.y < points.t0f.y) {
    points.x0 = points.t0b.shift(DOWN, (hpsToWaistBack - backNeckDepth) / 3);
  } else {
    points.x0 = points.t0f.shift(DOWN, (hpsToWaistBack - backNeckDepth) / 3);
  }

  points.underArmSide = points.x0.shift(DOWN, HBW + 2 * CM * chestEaseFactor);

  store.set("sideSeamLength", points.sideBackWaist.dist(points.underArmSide));

  // DEBUG PATHS
  // paths.chestLine = new Path()
  //   .move(points.a)
  //   .line(points.c)
  //   .line(points.b)

  // paths.frontBase = new Path()
  //   .move(points.shoulderFront)
  //   .line(points.hpsFront)
  //   .line(points.centerFrontNeck)
  //   .line(points.centerFrontWaist)
  //   .line(points.sideFrontWaist)
  //   .line(points.underArmSide)

  // paths.backBase = new Path()
  //   .move(points.shoulderBack)
  //   .line(points.hpsBack)
  //   .line(points.centerBackNeck)
  //   .line(points.centerBackWaist)
  //   .line(points.sideBackWaist)
  //   .line(points.underArmSide)

  return part
}
