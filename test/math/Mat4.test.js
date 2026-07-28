import { Mat4 } from '../../src/math/Mat4.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual, assertVec3Equal } from '../assert.js';

export const Mat4Tests = {
  'identity': () => {
    const m = new Mat4().identity();
    assertEqual(m.determinant(), 1);
  },
  'translation and position': () => {
    const m = new Mat4().makeTranslation(10, 20, 30);
    const pos = new Vec3();
    m.getPosition(pos);
    assertVec3Equal(pos, new Vec3(10, 20, 30));
  },
  'scale': () => {
    const m = new Mat4().makeScale(2, 3, 4);
    const v = new Vec3(1, 1, 1).applyMat4(m);
    assertVec3Equal(v, new Vec3(2, 3, 4));
  }
};
