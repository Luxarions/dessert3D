import { Cylinder } from '../../src/math/Cylinder.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const CylinderTests = {
  'containsPoint': () => {
    const cyl = new Cylinder(new Vec3(0, 0, 0), 2, 4);
    assertTrue(cyl.containsPoint(new Vec3(1, 1, 1)));
    assertFalse(cyl.containsPoint(new Vec3(3, 0, 0)));
  }
};
