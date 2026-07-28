import { OBB } from '../../src/math/OBB.js';
import { Bound3 } from '../../src/math/Bound3.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const OBBTests = {
  'fromBound3': () => {
    const box = new Bound3(new Vec3(-2, -2, -2), new Vec3(2, 2, 2));
    const obb = new OBB().fromBound3(box);
    assertTrue(obb.containsPoint(new Vec3(0, 0, 0)));
    assertTrue(obb.containsPoint(new Vec3(1.5, 1.5, 1.5)));
    assertFalse(obb.containsPoint(new Vec3(3, 0, 0)));
  },
  'intersectsOBB': () => {
    const obb1 = new OBB(new Vec3(0, 0, 0), new Vec3(1, 1, 1));
    const obb2 = new OBB(new Vec3(1.5, 0, 0), new Vec3(1, 1, 1));
    const obb3 = new OBB(new Vec3(5, 0, 0), new Vec3(1, 1, 1));
    assertTrue(obb1.intersectsOBB(obb2));
    assertFalse(obb1.intersectsOBB(obb3));
  }
};
