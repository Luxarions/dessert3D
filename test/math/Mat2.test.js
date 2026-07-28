import { Mat2 } from '../../src/math/Mat2.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const Mat2Tests = {
  'identity matrix': () => {
    const m = new Mat2().identity();
    assertEqual(m.elements[0], 1);
    assertEqual(m.elements[1], 0);
    assertEqual(m.elements[2], 0);
    assertEqual(m.elements[3], 1);
  },
  'determinant': () => {
    const m = new Mat2(2, 1, 3, 4);
    assertEqual(m.determinant(), 5); // 2*4 - 1*3 = 5
  },
  'invert': () => {
    const m = new Mat2(4, 7, 2, 6);
    m.invert();
    assertAlmostEqual(m.elements[0], 0.6);
    assertAlmostEqual(m.elements[1], -0.7);
  }
};
