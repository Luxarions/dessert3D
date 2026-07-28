import { Matrix } from '../../src/math/Matrix.js';
import { assertEqual } from '../assert.js';

export const MatrixTests = {
  'generic matrix creation': () => {
    const m = new Matrix(3, 3);
    assertEqual(m.rows, 3);
    assertEqual(m.cols, 3);
    assertEqual(m.elements.length, 9);
  },
  'set and get': () => {
    const m = new Matrix(2, 2);
    m.set(0, 1, 5);
    assertEqual(m.get(0, 1), 5);
  }
};
