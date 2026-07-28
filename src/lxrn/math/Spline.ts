/**
 * LXRN Spline
 * @module Spline
 */

import { Vec3 } from './Vec3';
import { CatmullRomCurve3 } from './CatmullRom';

export class Spline3 extends CatmullRomCurve3 {
  constructor(points: Vec3[] = [], closed: boolean = false) {
    super(points, closed, 'catmullrom');
  }
}
