import { BSpline } from '../../src/math/BSpline.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const BSplineTests = {
  'evaluation': () => {
    const pts = [
      new Vec3(0, 0, 0),
      new Vec3(2, 4, 0),
      new Vec3(4, 4, 0),
      new Vec3(6, 0, 0)
    ];
    const bspline = new BSpline(pts, 3);
    assertVec3Equal(bspline.getPoint(0), pts[0]);
    assertVec3Equal(bspline.getPoint(1), pts[3]);
  }
};
