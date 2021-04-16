import { LEFT, DOWN, RIGHT, UP, CM_FACTOR } from './constants';

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

  const { chest, shoulderSlope, waist } = measurements;
  const { chestEase, waistEase } = options;
  const chestEaseFactor = 1 + chestEase;
  const finalWaist = waist * (1 + waistEase);

  const CM = store.get("CM");
  const HBW = chest / 20;
  points.nCp = points.centerBackNeck.shift(LEFT, HBW * 0.4);
  points.sCp = points.hpsBack.shift(DOWN + shoulderSlope, HBW * 0.4);

  const sideSeamAngle = 90 - points.sideBackWaist.angle(points.underArmSide);

  points.uCp = points.underArmSide.shift(RIGHT - sideSeamAngle, HBW * 1.5 * chestEaseFactor);
  points.tCp = points.shoulderBack.shift(DOWN + shoulderSlope, HBW * 1.2);

  // Back waist dart
  const backDartSize = points.sideBackWaist.dist(points.centerBackWaist) - store.get("finalBackWaist");

  points.e1 = points.centerBackWaist.shift(LEFT, finalWaist / 10);
  points.e2 = points.e1.shift(LEFT, backDartSize)
  points.eCenter = points.e1.shift(LEFT, backDartSize / 2);
  points.eTip = points.eCenter.shift(UP, points.centerBackWaist.dist(points.b) - 2 * CM);

  /*
  True waist darts
  - lengthen them by a bit,
  - calculate control points to curve waistline
*/
  const dartSize = points.e1.dist(points.e2);

  points.e1 = points.e1.shiftFractionTowards(points.eTip, -0.001 * dartSize);
  let rightDartAngle = points.e1.angle(points.eTip);
  points.e1Cp = points.e1.shift(rightDartAngle - 90, 2 * CM);

  points.e2 = points.e2.shiftFractionTowards(points.eTip, -0.001 * dartSize);
  let leftDartAngle = points.e2.angle(points.eTip);
  points.e2Cp = points.e2.shift(leftDartAngle + 90, 2 * CM);

  if (dartSize > 1 * CM) {
    points.waistDartCenter = utils.beamsIntersect(points.e1Cp, points.e1, points.e2, points.e2Cp)
  } else {
    points.waistDartCenter = points.eCenter.copy()
  }

  // Armhole dart
  points.s2 = points.hpsBack.shiftFractionTowards(points.shoulderBack, 0.33)
  points.s5 = points.s2.shift(DOWN, 11 * CM);
  points.qCenter = utils.curveIntersectsY(points.underArmSide, points.uCp, points.tCp, points.shoulderBack, points.s5.y);

  points.q1 = points.qCenter.shift(UP, 0.65 * CM)
  points.q2 = points.qCenter.shift(DOWN, 0.65 * CM)

  const lowerArmhole = new Path().move(points.underArmSide).curve_(points.uCp, points.q2).length();
  const armhole = lowerArmhole + new Path().move(points.q1)._curve(points.tCp, points.shoulderBack).length();
  store.set("backArmhole", armhole);

  paths.seamLines = new Path()
    .move(points.hpsBack)
    .line(points.shoulderBack)
    ._curve(points.tCp, points.q1)
    .line(points.s5)
    .line(points.q2)
    ._curve(points.uCp, points.underArmSide)
    .line(points.sideBackWaist)
    ._curve(points.e2Cp, points.e2)
    .line(points.eTip)
    .line(points.e1)
    .curve_(points.e1Cp, points.centerBackWaist)
    .line(points.centerBackNeck)
    .curve(points.nCp, points.sCp, points.hpsBack)
    .attr("class", "fabric")

  paths.saBase = new Path()
    .move(points.hpsBack)
    .line(points.shoulderBack)
    ._curve(points.tCp, points.q1)
    .line(points.s5)
    .line(points.q2)
    ._curve(points.uCp, points.underArmSide)
    .line(points.sideBackWaist)
    ._curve(points.e2Cp, points.e2)
    .line(points.waistDartCenter)
    .line(points.e1)
    .curve_(points.e1Cp, points.centerBackWaist)
    .line(points.centerBackNeck)
    .curve(points.nCp, points.sCp, points.hpsBack)
    .setRender(false)


  // Complete?
  if (complete) {

    macro('grainline', {
      from: points.centerBackNeck.shift(DOWN, 1 * CM).shift(LEFT, 1 * CM),
      to: points.centerBackWaist.shift(UP, 1 * CM).shift(LEFT, 1 * CM),
      grainline: true
    });

    points.titleAnchor = points.eTip.shift(UP, 5 * CM);
    macro('title', {
      at: points.titleAnchor,
      nr: 2,
      title: 'back'
    });

    if (sa) {
      paths.sa = paths.saBase.offset(sa).attr('class', 'fabric sa')
    }
  }

  // Paperless?
  if (paperless) {

  }

  return part
}
