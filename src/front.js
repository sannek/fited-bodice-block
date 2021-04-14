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

  const frontAngle = store.get("frontAngle");
  const veryLargeCup = store.get("veryLargeCup")
  const largeCup = store.get("largeCup");
  // Neckline curve control points
  points.mCp = points.centerFrontNeck.shift(RIGHT - frontAngle, HBW * 0.8);
  points.sCp = points.hpsFront.shift(DOWN - shoulderSlope, HBW * 0.4)

  // front shoulder dart points
  const frontShoulderWidth = points.hpsFront.dist(points.shoulderFront);

  points.v1 = points.a.shift(RIGHT, bustSpan / 2);
  points.v = points.hpsFront.shiftTowards(points.v1, hpsToBust);
  points.u = points.hpsFront.shiftTowards(points.shoulderFront, frontShoulderWidth / 2)

  let shoulderDartSize = (chest - highBust) / 2;
  if (!veryLargeCup) {
    if (chest * chestEase < 6 * CM) {
      shoulderDartSize += 4 * CM;
    } else if (chest * chestEase < 10 * CM) {
      shoulderDartSize += 2 * CM;
    }
  }

  if (shoulderDartSize > 0) {
    const shoulderIntersect = utils.beamIntersectsCircle(points.u, shoulderDartSize, points.hpsFront, points.shoulderFront);
    points.u1a = shoulderIntersect[1]; // lowest and rightmost intersection
  } else {
    points.u1a = points.hpsFront.shiftTowards(points.shoulderFront, frontShoulderWidth / 2)
  }

  points.u1 = points.v.shiftTowards(points.u1a, points.v.dist(points.u));

  const shoulderDartAngle = points.u.angle(points.v) - points.u1.angle(points.v);
  const shoulderCP = 7 * CM * chestEaseFactor * chestEaseFactor;
  points.t = points.u1.shift(RIGHT - shoulderSlope - frontAngle - shoulderDartAngle, frontShoulderWidth / 2);
  points.tCp = points.t.shift(DOWN - shoulderSlope - frontAngle - shoulderDartAngle, shoulderCP);


  // Side dart
  points.f10 = points.v.shift(RIGHT - frontAngle, BEAM)
  // where top leg of side dart crosses side seam
  points.f1 = utils.beamsIntersect(points.v, points.f10, points.underArmSide, points.sideFrontWaist);

  /* with a very large bust size the side dart ends up way too large
  but if the bust point is high there might not be enough space
  between the underside of the armhole and the top leg of the side dart */

  let lowerFrontUnderArm = veryLargeCup ? 3 * CM : 2 * CM;
  const sideDartToUnderarm = points.f1.dist(points.underArmSide);
  if (sideDartToUnderarm - lowerFrontUnderArm <= 3.5 * CM) {
    lowerFrontUnderArm = Math.max(sideDartToUnderarm - 3.5 * CM, 0)
  }

  points.frontUnderArm = points.underArmSide.shiftTowards(points.sideFrontWaist, lowerFrontUnderArm);
  const underArmCP = 7 * CM * chestEaseFactor * chestEaseFactor;
  points.uCp = points.frontUnderArm.shift(LEFT - frontAngle, underArmCP);

  // Rotate the shoulder dart closed.
  const bustPoint = points.v;
  points.closed_u1 = points.u1.rotate(shoulderDartAngle, bustPoint);
  points.closed_t = points.t.rotate(shoulderDartAngle, bustPoint);
  points.closed_frontUnderArm = points.frontUnderArm.rotate(shoulderDartAngle, bustPoint);
  points.closed_f1 = points.f1.rotate(shoulderDartAngle, bustPoint);
  points.closed_tCp = points.tCp.rotate(shoulderDartAngle, bustPoint);
  points.closed_uCp = points.uCp.rotate(shoulderDartAngle, bustPoint);

  const armhole = new Path().move(points.closed_frontUnderArm).curve(points.closed_uCp, points.closed_tCp, points.closed_t).length();
  store.set("frontArmhole", armhole);

  // TO DO: tweak dart legs to close with proper angles
  const backSideSeamLength = store.get("sideSeamLength");
  const sideDartSize = points.sideFrontWaist.dist(points.frontUnderArm) - backSideSeamLength;

  const sideIntersect = utils.circlesIntersect(points.f1, sideDartSize, points.v, points.v.dist(points.f1), "y");
  points.f2 = sideIntersect[1];

  // Waist dart
  const finalFrontWaist = store.get("finalFrontWaist");
  const frontDartSize = points.centerFrontWaist.dist(points.sideFrontWaist) - finalFrontWaist;

  // console.log({ waist, finalFrontWaist, frontDartSize })

  points.vDownBeam = points.v.shift(DOWN - frontAngle, BEAM);
  points.dCenter = utils.beamsIntersect(points.centerFrontWaist, points.sideFrontWaist, points.v, points.vDownBeam);
  points.d1 = points.dCenter.shiftTowards(points.centerFrontWaist, frontDartSize / 2);
  points.d2 = points.dCenter.shiftTowards(points.sideFrontWaist, frontDartSize / 2);

  // Move dart legs slightly away from bust point
  points.v_side = points.v.shiftTowards(points.f1, 3 * CM)
  points.v_waist = points.v.shift(DOWN - frontAngle, 3 * CM);

  paths.frontBase = new Path()
    .move(points.hpsFront)
    .curve(points.sCp, points.mCp, points.centerFrontNeck)
    .line(points.centerFrontWaist)
    .line(points.d1)
    .line(points.v_waist)
    .line(points.d2)
    .line(points.sideFrontWaist)
    .line(points.f2)
    .line(points.v_side)
    .line(points.closed_f1)
    .line(points.closed_frontUnderArm)
    .curve(points.closed_uCp, points.closed_tCp, points.closed_t)
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
