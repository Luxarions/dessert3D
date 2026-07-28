import { Cone } from '../../src/math/Cone.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const ConeTests = {
  'containsPoint': () => {
    const cone = new Cone(new Vec3(0, 2, 0), new Vec3(0, -1, 0), Math.PI / 4, 2);
    assertTrue(cone.containsPoint(new Vec3(0, 1, 0)));
    assertFalse(cone.containsPoint(new Vec3(5, 1, 0)));
  }
};
