import { Vec4 } from '../../src/math/Vec4.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const Vec4Tests = {
  'constructor and components': () => {
    const v = new Vec4(1, 2, 3, 4);
    assertEqual(v.x, 1);
    assertEqual(v.y, 2);
    assertEqual(v.z, 3);
    assertEqual(v.w, 4);
  },
  'dot product': () => {
    const v1 = new Vec4(1, 2, 3, 4);
    const v2 = new Vec4(2, 3, 4, 5);
    assertEqual(v1.dot(v2), 2 + 6 + 12 + 20);
  },
  'normalize': () => {
    const v = new Vec4(2, 0, 0, 0);
    v.normalize();
    assertEqual(v.x, 1);
    assertEqual(v.y, 0);
  }
};
