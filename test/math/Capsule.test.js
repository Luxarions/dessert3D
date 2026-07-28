import { Capsule } from '../../src/math/Capsule.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const CapsuleTests = {
  'containsPoint': () => {
    const cap = new Capsule(new Vec3(0, 0, 0), new Vec3(0, 4, 0), 1);
    assertTrue(cap.containsPoint(new Vec3(0, 2, 0.5)));
    assertFalse(cap.containsPoint(new Vec3(3, 2, 0)));
  }
};
