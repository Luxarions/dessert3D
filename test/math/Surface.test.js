import { Surface } from '../../src/math/Surface.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const SurfaceTests = {
  'bilinear patch evaluation': () => {
    const grid = [
      [new Vec3(0, 0, 0), new Vec3(10, 0, 0)],
      [new Vec3(0, 10, 0), new Vec3(10, 10, 0)]
    ];
    const s = new Surface(grid);
    assertVec3Equal(s.getPoint(0, 0), new Vec3(0, 0, 0));
    assertVec3Equal(s.getPoint(0.5, 0.5), new Vec3(5, 5, 0));
    assertVec3Equal(s.getPoint(1, 1), new Vec3(10, 10, 0));
  }
};
