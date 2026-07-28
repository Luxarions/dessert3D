import { Complex } from '../../src/math/Complex.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const ComplexTests = {
  'creation and addition': () => {
    const c1 = new Complex(2, 3);
    const c2 = new Complex(4, -1);
    c1.add(c2);
    assertEqual(c1.real, 6);
    assertEqual(c1.imag, 2);
  },
  'multiplication': () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    c1.multiply(c2); // (1+2i)(3+4i) = 3 - 8 + (4+6)i = -5 + 10i
    assertEqual(c1.real, -5);
    assertEqual(c1.imag, 10);
  }
};
