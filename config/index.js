import { version } from "../package.json";

// ?? 🤔 ?? --> https://en.freesewing.dev/packages/core/config

export default {
  name: "danckaerts-bodice",
  version,
  design: "sannek",
  code: "sannek",
  department: "womenswear",
  type: "block",
  difficulty: 3,
  tags: [
    "freesewing",
    "design",
    "diy",
    "fashion",
    "made to measure",
    "parametric design",
    "block",
    "sewing",
    "sewing pattern"
  ],
  optionGroups: {
    fit: ["chestEase", "waistEase"]
  },
  measurements: [
    "bustSpan",
    "chest",
    "highBust",
    "hpsToBust",
    "hpsToWaistBack",
    "hpsToWaistFront",
    "shoulderSlope",
    "waist",
    "shoulderToShoulder"
  ],
  dependencies: {},
  inject: {},
  hide: [],
  parts: ["base", "back"],
  options: {
    chestEase: { pct: 10, min: 5, max: 25 },
    waistEase: { pct: 10, min: 5, max: 25 }
  }
};
