import { Line3 } from '../../src/math/Line3.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual } from '../assert.js';

export const Line3Tests = {
  'at parameter': () => {
    const line = new Line3(new Vec3(0, 0, 0), new Vec3(10, 20, 30));
    const pt = line.at(0.5);
    assertEqual(pt.x, 5);
    assertEqual(pt.y, 10);
    assertEqual(pt.z, 15);
  }
};
