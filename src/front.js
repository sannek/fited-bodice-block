import { LEFT, DOWN, RIGHT, BEAM, CM_FACTOR } from './constants';

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
    store,
    utils
  } = part.shorthand()


  const { chest, shoulderSlope, bustSpan, hpsToBust, highBust, waist } = measurements;
  const { chestEase } = options;
  const chestEaseFactor = 1 + chestEase;
  const HBW = chest / 20;
  const CM = chest * CM_FACTOR;

  const frontAngle = store.get("frontAngle")

  // Neckline curve control points
  points.mCp = points.centerFrontNeck.shift(RIGHT - frontAngle, HBW * 0.8);
  points.sCp = points.hpsFront.shift(DOWN - shoulderSlope, HBW * 0.4)

  // Armhole curve control points
  const sideSeamAngle = 90 - points.sideFrontWaist.angle(points.underArmSide);
  points.uCp = points.underArmSide.shift(LEFT - sideSeamAngle, HBW * 1.8 * chestEaseFactor * chestEaseFactor);

  // front shoulder dart points
  const frontShoulderWidth = points.hpsFront.dist(points.shoulderFront);

  points.v1 = points.a.shift(RIGHT, bustSpan / 2);
  points.v = points.hpsFront.shiftTowards(points.v1, hpsToBust);
  points.u = points.hpsFront.shiftTowards(points.shoulderFront, frontShoulderWidth / 2)

  let shoulderDartSize = (chest - highBust) / 2;
  if (chest * chestEase < 6 * CM) {
    shoulderDartSize += 4 * CM;
  } else if (chest * chestEase < 10 * CM) {
    shoulderDartSize += 2 * CM;
  }

  if (shoulderDartSize > 0) {
    const shoulderIntersect = utils.beamIntersectsCircle(points.u, shoulderDartSize, points.hpsFront, points.shoulderFront);
    points.u1a = shoulderIntersect[1]; // lowest and rightmost intersection
  } else {
    points.u1a = points.hpsFront.shiftTowards(points.shoulderFront, frontShoulderWidth / 2)
  }

  points.u1 = points.v.shiftTowards(points.u1a, points.v.dist(points.u));

  const shoulderDartAngle = points.u.angle(points.v) - points.u1.angle(points.v);
  points.t = points.u1.shift(RIGHT - shoulderSlope - frontAngle - shoulderDartAngle, frontShoulderWidth / 2);
  points.tCp = points.t.shift(DOWN - shoulderSlope - frontAngle - shoulderDartAngle, HBW * 1.3 * chestEaseFactor * chestEaseFactor);

  // Side dart
  // TO DO: tweak dart legs to close with proper angles
  const backSideSeamLength = store.get("sideSeamLength");
  const sideDartSize = points.sideFrontWaist.dist(points.underArmSide) - backSideSeamLength;
  points.f10 = points.v.shift(RIGHT - frontAngle, BEAM)
  points.f1 = utils.beamsIntersect(points.v, points.f10, points.underArmSide, points.sideFrontWaist);

  const sideIntersect = utils.circlesIntersect(points.f1, sideDartSize, points.v, points.v.dist(points.f1), "y");
  points.f2 = sideIntersect[1];


  // Waist dart
  const finalFrontWaist = store.get("finalFrontWaist");
  const frontDartSize = points.centerFrontWaist.dist(points.sideFrontWaist) - finalFrontWaist;

  console.log({ waist, finalFrontWaist, frontDartSize })

  points.vDownBeam = points.v.shift(DOWN - frontAngle, BEAM);
  points.dCenter = utils.beamsIntersect(points.centerFrontWaist, points.sideFrontWaist, points.v, points.vDownBeam);
  points.d1 = points.dCenter.shiftTowards(points.centerFrontWaist, frontDartSize / 2);
  points.d2 = points.dCenter.shiftTowards(points.sideFrontWaist, frontDartSize / 2);



  paths.frontBase = new Path()
    .move(points.hpsFront)
    .curve(points.sCp, points.mCp, points.centerFrontNeck)
    .line(points.centerFrontWaist)
    .line(points.d1)
    .line(points.v)
    .line(points.d2)
    .line(points.sideFrontWaist)
    .line(points.f2)
    .line(points.v)
    .line(points.f1)
    .line(points.underArmSide)
    .curve(points.uCp, points.tCp, points.t)
    .line(points.u1)
    .line(points.v)
    .line(points.u)
    .line(points.hpsFront)

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
