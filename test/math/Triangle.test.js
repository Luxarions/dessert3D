import { Triangle } from '../../src/math/Triangle.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual, assertTrue } from '../assert.js';

export const TriangleTests = {
  'getArea': () => {
    const tri = new Triangle(
      new Vec3(0, 0, 0),
      new Vec3(2, 0, 0),
      new Vec3(0, 2, 0)
    );
    assertAlmostEqual(tri.getArea(), 2);
  },
  'getNormal': () => {
    const tri = new Triangle(
      new Vec3(0, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0)
    );
    const n = tri.getNormal();
    assertAlmostEqual(n.z, 1);
  }
};
