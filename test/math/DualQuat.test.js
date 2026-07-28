import { DualQuat } from '../../src/math/DualQuat.js';
import { Quat } from '../../src/math/Quat.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertTrue } from '../assert.js';

export const DualQuatTests = {
  'identity creation': () => {
    const dq = new DualQuat();
    assertTrue(dq.real.equals(new Quat(0, 0, 0, 1)));
  },
  'setFromRotationTranslation': () => {
    const r = new Quat();
    const t = new Vec3(10, 20, 30);
    const dq = new DualQuat().setFromRotationTranslation(r, t);
    const outT = dq.getTranslation();
    assertEqual(outT.x, 10);
    assertEqual(outT.y, 20);
    assertEqual(outT.z, 30);
  }
};
