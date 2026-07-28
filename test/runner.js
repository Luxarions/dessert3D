/**
 * LXRN Test Runner Entry Point
 */

import { TestRunner } from './assert.js';

import { Vec2Tests } from './math/Vec2.test.js';
import { Vec3Tests } from './math/Vec3.test.js';
import { Vec4Tests } from './math/Vec4.test.js';
import { Mat2Tests } from './math/Mat2.test.js';
import { Mat3Tests } from './math/Mat3.test.js';
import { Mat4Tests } from './math/Mat4.test.js';
import { MatrixTests } from './math/Matrix.test.js';
import { MatrixStackTests } from './math/MatrixStack.test.js';

import { QuatTests } from './math/Quat.test.js';
import { EulerTests } from './math/Euler.test.js';
import { DualQuatTests } from './math/DualQuat.test.js';
import { ComplexTests } from './math/Complex.test.js';
import { MathUtilsTests } from './math/MathUtils.test.js';

import { Bound2Tests } from './math/Bound2.test.js';
import { Bound3Tests } from './math/Bound3.test.js';
import { OBBTests } from './math/OBB.test.js';
import { SphereTests } from './math/Sphere.test.js';
import { PlaneTests } from './math/Plane.test.js';
import { RayTests } from './math/Ray.test.js';
import { FrustumTests } from './math/Frustum.test.js';
import { TriangleTests } from './math/Triangle.test.js';
import { Triangle2Tests } from './math/Triangle2.test.js';
import { Line2Tests } from './math/Line2.test.js';
import { Line3Tests } from './math/Line3.test.js';
import { IntersectionTests } from './math/Intersection.test.js';
import { CapsuleTests } from './math/Capsule.test.js';
import { CylinderTests } from './math/Cylinder.test.js';
import { ConeTests } from './math/Cone.test.js';
import { TorusTests } from './math/Torus.test.js';

import { BezierTests } from './math/Bezier.test.js';
import { SplineTests } from './math/Spline.test.js';
import { BSplineTests } from './math/BSpline.test.js';
import { NURBSTests } from './math/NURBS.test.js';
import { HermiteTests } from './math/Hermite.test.js';
import { CatmullRomTests } from './math/CatmullRom.test.js';
import { CurvePathTests } from './math/CurvePath.test.js';
import { SurfaceTests } from './math/Surface.test.js';
import { InterpolantTests } from './math/Interpolant.test.js';

export async function runAllMathTests() {
  const runner = new TestRunner();

  runner.addSuite('Vec2', Vec2Tests);
  runner.addSuite('Vec3', Vec3Tests);
  runner.addSuite('Vec4', Vec4Tests);
  runner.addSuite('Mat2', Mat2Tests);
  runner.addSuite('Mat3', Mat3Tests);
  runner.addSuite('Mat4', Mat4Tests);
  runner.addSuite('Matrix', MatrixTests);
  runner.addSuite('MatrixStack', MatrixStackTests);

  runner.addSuite('Quat', QuatTests);
  runner.addSuite('Euler', EulerTests);
  runner.addSuite('DualQuat', DualQuatTests);
  runner.addSuite('Complex', ComplexTests);
  runner.addSuite('MathUtils', MathUtilsTests);

  runner.addSuite('Bound2', Bound2Tests);
  runner.addSuite('Bound3', Bound3Tests);
  runner.addSuite('OBB', OBBTests);
  runner.addSuite('Sphere', SphereTests);
  runner.addSuite('Plane', PlaneTests);
  runner.addSuite('Ray', RayTests);
  runner.addSuite('Frustum', FrustumTests);
  runner.addSuite('Triangle', TriangleTests);
  runner.addSuite('Triangle2', Triangle2Tests);
  runner.addSuite('Line2', Line2Tests);
  runner.addSuite('Line3', Line3Tests);
  runner.addSuite('Intersection', IntersectionTests);
  runner.addSuite('Capsule', CapsuleTests);
  runner.addSuite('Cylinder', CylinderTests);
  runner.addSuite('Cone', ConeTests);
  runner.addSuite('Torus', TorusTests);

  runner.addSuite('Bezier', BezierTests);
  runner.addSuite('Spline', SplineTests);
  runner.addSuite('BSpline', BSplineTests);
  runner.addSuite('NURBS', NURBSTests);
  runner.addSuite('Hermite', HermiteTests);
  runner.addSuite('CatmullRom', CatmullRomTests);
  runner.addSuite('CurvePath', CurvePathTests);
  runner.addSuite('Surface', SurfaceTests);
  runner.addSuite('Interpolant', InterpolantTests);

  return await runner.runAll();
}
