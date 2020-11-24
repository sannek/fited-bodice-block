import { LEFT, DOWN, RIGHT } from './constants';

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

  const { chest, shoulderSlope } = measurements;
  const { chestEase } = options;
  const chestEaseFactor = 1 + chestEase;
  const HBW = chest / 20;

  const frontAngle = store.get("frontAngle")

  points.mCp = points.centerFrontNeck.shift(RIGHT - frontAngle, HBW * 0.8);
  points.sCp = points.hpsFront.shift(DOWN - shoulderSlope, HBW * 0.4)

  const sideSeamAngle = 90 - points.sideFrontWaist.angle(points.underArmSide);
  points.uCp = points.underArmSide.shift(LEFT - sideSeamAngle, HBW * 1.8 * chestEaseFactor);
  points.tCp = points.shoulderFront.shift(DOWN - shoulderSlope, HBW * 1.2);

  paths.frontBase = new Path()
    .move(points.hpsFront)
    .curve(points.sCp, points.mCp, points.centerFrontNeck)
    .line(points.centerFrontWaist)
    .line(points.sideFrontWaist)
    .line(points.underArmSide)
    .curve(points.uCp, points.tCp, points.shoulderFront)
    .close()

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
