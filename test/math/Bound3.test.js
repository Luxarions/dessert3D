import { Bound3 } from '../../src/math/Bound3.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertTrue, assertFalse } from '../assert.js';

export const Bound3Tests = {
  'expandByPoint and containsPoint': () => {
    const b = new Bound3().makeEmpty();
    b.expandByPoint(new Vec3(-1, -2, -3));
    b.expandByPoint(new Vec3(1, 2, 3));
    assertTrue(b.containsPoint(new Vec3(0, 0, 0)));
    assertFalse(b.containsPoint(new Vec3(5, 0, 0)));
  },
  'getCenter and getSize': () => {
    const b = new Bound3(new Vec3(0, 0, 0), new Vec3(10, 20, 30));
    const center = new Vec3();
    const size = new Vec3();
    b.getCenter(center);
    b.getSize(size);
    assertEqual(center.x, 5);
    assertEqual(center.y, 10);
    assertEqual(size.z, 30);
  }
};
