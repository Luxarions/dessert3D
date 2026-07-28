import { Bezier } from '../../src/math/Bezier.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const BezierTests = {
  'endpoints': () => {
    const v0 = new Vec3(0, 0, 0);
    const v1 = new Vec3(1, 2, 0);
    const v2 = new Vec3(3, 2, 0);
    const v3 = new Vec3(4, 0, 0);
    const bez = new Bezier(v0, v1, v2, v3);
    assertVec3Equal(bez.getPoint(0), v0);
    assertVec3Equal(bez.getPoint(1), v3);
  }
};
