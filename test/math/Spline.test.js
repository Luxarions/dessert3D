import { Spline } from '../../src/math/Spline.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const SplineTests = {
  'getPoint': () => {
    const pts = [new Vec3(0, 0, 0), new Vec3(5, 5, 0), new Vec3(10, 0, 0)];
    const spline = new Spline(pts);
    assertVec3Equal(spline.getPoint(0), pts[0]);
    assertVec3Equal(spline.getPoint(1), pts[2]);
  }
};
