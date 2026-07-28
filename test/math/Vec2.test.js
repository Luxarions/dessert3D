import { Vec2 } from '../../src/math/Vec2.js';
import { assertEqual, assertAlmostEqual, assertTrue, assertFalse } from '../assert.js';

export const Vec2Tests = {
  'constructor and default values': () => {
    const v = new Vec2();
    assertEqual(v.x, 0);
    assertEqual(v.y, 0);
  },
  'set and copy': () => {
    const v1 = new Vec2().set(3, 4);
    const v2 = new Vec2().copy(v1);
    assertEqual(v2.x, 3);
    assertEqual(v2.y, 4);
  },
  'add and sub': () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    v1.add(v2);
    assertEqual(v1.x, 4);
    assertEqual(v1.y, 6);
    v1.sub(v2);
    assertEqual(v1.x, 1);
    assertEqual(v1.y, 2);
  },
  'length and normalize': () => {
    const v = new Vec2(3, 4);
    assertEqual(v.length(), 5);
    v.normalize();
    assertAlmostEqual(v.x, 0.6);
    assertAlmostEqual(v.y, 0.8);
    assertAlmostEqual(v.length(), 1.0);
  },
  'dot product': () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    assertEqual(v1.dot(v2), 11);
  }
};
