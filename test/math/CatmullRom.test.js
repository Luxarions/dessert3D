import { CatmullRom } from '../../src/math/CatmullRom.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertVec3Equal } from '../assert.js';

export const CatmullRomTests = {
  'evaluation': () => {
    const pts = [
      new Vec3(0, 0, 0),
      new Vec3(2, 2, 0),
      new Vec3(4, 0, 0),
      new Vec3(6, 2, 0)
    ];
    const cm = new CatmullRom(pts);
    assertVec3Equal(cm.getPoint(0), pts[0]);
    assertVec3Equal(cm.getPoint(1), pts[3]);
  }
};
