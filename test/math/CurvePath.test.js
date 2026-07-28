import { CurvePath } from '../../src/math/CurvePath.js';
import { Spline } from '../../src/math/Spline.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual } from '../assert.js';

export const CurvePathTests = {
  'add and getPoint': () => {
    const cp = new CurvePath();
    cp.add(new Spline([new Vec3(0, 0, 0), new Vec3(5, 0, 0)]));
    cp.add(new Spline([new Vec3(5, 0, 0), new Vec3(10, 0, 0)]));
    assertEqual(cp.curves.length, 2);
    const pt = cp.getPoint(0.5);
    assertEqual(pt.x, 5);
  }
};
