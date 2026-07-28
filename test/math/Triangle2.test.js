import { Triangle2 } from '../../src/math/Triangle2.js';
import { Vec2 } from '../../src/math/Vec2.js';
import { assertAlmostEqual, assertTrue } from '../assert.js';

export const Triangle2Tests = {
  'getArea': () => {
    const tri = new Triangle2(new Vec2(0, 0), new Vec2(4, 0), new Vec2(0, 3));
    assertAlmostEqual(tri.getArea(), 6);
  },
  'containsPoint': () => {
    const tri = new Triangle2(new Vec2(0, 0), new Vec2(4, 0), new Vec2(0, 3));
    assertTrue(tri.containsPoint(new Vec2(1, 1)));
  }
};
