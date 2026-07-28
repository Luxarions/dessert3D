import { Torus } from '../../src/math/Torus.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const TorusTests = {
  'containsPoint': () => {
    const torus = new Torus(new Vec3(0, 0, 0), 5, 1);
    assertTrue(torus.containsPoint(new Vec3(5, 0, 0)));
    assertFalse(torus.containsPoint(new Vec3(0, 0, 0)));
  }
};
