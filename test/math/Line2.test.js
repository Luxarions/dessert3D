import { Line2 } from '../../src/math/Line2.js';
import { Vec2 } from '../../src/math/Vec2.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const Line2Tests = {
  'distance and center': () => {
    const line = new Line2(new Vec2(0, 0), new Vec2(3, 4));
    assertEqual(line.distance(), 5);
    const center = line.getCenter();
    assertEqual(center.x, 1.5);
    assertEqual(center.y, 2);
  }
};
