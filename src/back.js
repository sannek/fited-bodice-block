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
