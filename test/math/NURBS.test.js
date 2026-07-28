import { NURBS } from '../../src/math/NURBS.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const NURBSTests = {
  'getPoint': () => {
    const pts = [new Vec3(0, 0, 0), new Vec3(2, 4, 0), new Vec3(4, 0, 0)];
    const weights = [1, 2, 1];
    const nurbs = new NURBS(pts, weights, 2);
    assertVec3Equal(nurbs.getPoint(0), pts[0]);
    assertVec3Equal(nurbs.getPoint(1), pts[2]);
  }
};
