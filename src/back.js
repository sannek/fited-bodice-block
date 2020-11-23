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
    utils
  } = part.shorthand()

  const { chest, shoulderSlope } = measurements;
  const { chestEase } = options;
  const chestEaseFactor = 1 + chestEase;
  const HBW = chest / 20;
  points.nCp = points.centerBackNeck.shift(LEFT, HBW * 0.4);
  points.sCp = points.hpsBack.shift(DOWN + shoulderSlope, HBW * 0.4);

  const sideSeamAngle = 90 - points.sideBackWaist.angle(points.underArmSide);

  points.uCp = points.underArmSide.shift(RIGHT - sideSeamAngle, HBW * 1.2 * chestEaseFactor);
  points.tCp = points.shoulderBack.shift(DOWN + shoulderSlope, HBW * 1.2);


  paths.backBase = new Path()
    .move(points.hpsBack)
    .curve(points.sCp, points.nCp, points.centerBackNeck)
    .line(points.centerBackWaist)
    .line(points.sideBackWaist)
    .line(points.underArmSide)
    .curve(points.uCp, points.tCp, points.shoulderBack)
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
