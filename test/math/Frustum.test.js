import { Frustum } from '../../src/math/Frustum.js';
import { Sphere } from '../../src/math/Sphere.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { Mat4 } from '../../src/math/Mat4.js';
import { assertTrue, assertFalse } from '../assert.js';

export const FrustumTests = {
  'setFromProjectionMatrix and intersectsSphere': () => {
    const proj = new Mat4().makePerspective(-1, 1, 1, -1, 1, 100);
    const frustum = new Frustum().setFromProjectionMatrix(proj);
    const insideSphere = new Sphere(new Vec3(0, 0, -5), 1);
    const outsideSphere = new Sphere(new Vec3(0, 0, 10), 1);
    assertTrue(frustum.intersectsSphere(insideSphere));
    assertFalse(frustum.intersectsSphere(outsideSphere));
  }
};
