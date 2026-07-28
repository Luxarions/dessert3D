import { Mat3 } from '../../src/math/Mat3.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const Mat3Tests = {
  'identity and determinant': () => {
    const m = new Mat3().identity();
    assertEqual(m.determinant(), 1);
  },
  'transpose': () => {
    const m = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    m.transpose();
    assertEqual(m.elements[1], 2);
    assertEqual(m.elements[3], 4);
  }
};
