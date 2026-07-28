import { Interpolant } from '../../src/math/Interpolant.js';
import { assertAlmostEqual } from '../assert.js';

export const InterpolantTests = {
  'evaluate linear interpolation': () => {
    const times = new Float32Array([0, 1, 2]);
    const values = new Float32Array([0, 10, 20]);
    const interp = new Interpolant(times, values, 1);
    
    const res1 = interp.evaluate(0.5);
    assertAlmostEqual(res1[0], 5);

    const res2 = interp.evaluate(1.5);
    assertAlmostEqual(res2[0], 15);
  }
};
