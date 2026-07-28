import { Hermite } from '../../src/math/Hermite.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const HermiteTests = {
  'endpoints': () => {
    const p0 = new Vec3(0, 0, 0);
    const p1 = new Vec3(10, 0, 0);
    const t0 = new Vec3(0, 5, 0);
    const t1 = new Vec3(0, -5, 0);
    const h = new Hermite(p0, p1, t0, t1);
    assertVec3Equal(h.getPoint(0), p0);
    assertVec3Equal(h.getPoint(1), p1);
  }
};
