import { clamp, lerp, degToRad, radToDeg, isPowerOfTwo, floorPowerOfTwo, ceilPowerOfTwo } from '../../src/math/MathUtils.js';
import { assertEqual, assertAlmostEqual, assertTrue, assertFalse } from '../assert.js';

export const MathUtilsTests = {
  'clamp': () => {
    assertEqual(clamp(5, 0, 10), 5);
    assertEqual(clamp(-5, 0, 10), 0);
    assertEqual(clamp(15, 0, 10), 10);
  },
  'lerp': () => {
    assertEqual(lerp(0, 10, 0.5), 5);
  },
  'degToRad and radToDeg': () => {
    assertAlmostEqual(degToRad(180), Math.PI);
    assertAlmostEqual(radToDeg(Math.PI), 180);
  },
  'power of two functions': () => {
    assertTrue(isPowerOfTwo(16));
    assertFalse(isPowerOfTwo(18));
    assertEqual(floorPowerOfTwo(18), 16);
    assertEqual(ceilPowerOfTwo(18), 32);
  }
};
