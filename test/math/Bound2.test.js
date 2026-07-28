import { Bound2 } from '../../src/math/Bound2.js';
import { Vec2 } from '../../src/math/Vec2.js';
import { assertEqual, assertTrue, assertFalse } from '../assert.js';

export const Bound2Tests = {
  'makeEmpty and expandByPoint': () => {
    const b = new Bound2().makeEmpty();
    assertTrue(b.isEmpty());
    b.expandByPoint(new Vec2(5, 10));
    assertFalse(b.isEmpty());
    assertEqual(b.min.x, 5);
    assertEqual(b.max.y, 10);
  },
  'containsPoint': () => {
    const b = new Bound2(new Vec2(0, 0), new Vec2(10, 10));
    assertTrue(b.containsPoint(new Vec2(5, 5)));
    assertFalse(b.containsPoint(new Vec2(15, 5)));
  }
};
