// index.js - LXRN Core Library Entry Point
export * from './system/constants.js';
export * from './utils/utils.js';

// Components
export * from './components/Accordion.js';
export * from './components/Viewport.js';
export * from './components/App.js';

// Math
export * from './math/MathUtils.js';
export * from './math/Vec2.js';
export * from './math/Vec3.js';
export * from './math/Vec4.js';
export * from './math/Mat2.js';
export * from './math/Mat3.js';
export * from './math/Mat4.js';
export * from './math/Matrix.js';
export * from './math/MatrixStack.js';
export * from './math/Quat.js';
export * from './math/Euler.js';
export * from './math/DualQuat.js';
export * from './math/Complex.js';

// Geometry & Bounds
export * from './math/Bound2.js';
export * from './math/Bound3.js';
export * from './math/OBB.js';
export * from './math/Sphere.js';
export * from './math/Plane.js';
export * from './math/Ray.js';
export * from './math/Frustum.js';
export * from './math/Triangle.js';
export * from './math/Triangle2.js';
export * from './math/Line2.js';
export * from './math/Line3.js';
export * from './math/Intersection.js';
export * from './math/Capsule.js';
export * from './math/Cylinder.js';
export * from './math/Cone.js';
export * from './math/Torus.js';

// Curves & Surfaces
export * from './math/Bezier.js';
export * from './math/Spline.js';
export * from './math/BSpline.js';
export * from './math/NURBS.js';
export * from './math/Hermite.js';
export * from './math/CatmullRom.js';
export * from './math/CurvePath.js';
export * from './math/Surface.js';
export * from './math/Interpolant.js';

// LXRN Namespace
import * as AccordionModule from './components/Accordion.js';
import * as ViewportModule from './components/Viewport.js';
import * as AppModule from './components/App.js';
import * as MathUtilsModule from './math/MathUtils.js';
import * as Vec2Module from './math/Vec2.js';
import * as Vec3Module from './math/Vec3.js';
import * as Vec4Module from './math/Vec4.js';
import * as Mat2Module from './math/Mat2.js';
import * as Mat3Module from './math/Mat3.js';
import * as Mat4Module from './math/Mat4.js';
import * as MatrixModule from './math/Matrix.js';
import * as MatrixStackModule from './math/MatrixStack.js';
import * as QuatModule from './math/Quat.js';
import * as EulerModule from './math/Euler.js';
import * as DualQuatModule from './math/DualQuat.js';
import * as ComplexModule from './math/Complex.js';
import * as Bound2Module from './math/Bound2.js';
import * as Bound3Module from './math/Bound3.js';
import * as OBBModule from './math/OBB.js';
import * as SphereModule from './math/Sphere.js';
import * as PlaneModule from './math/Plane.js';
import * as RayModule from './math/Ray.js';
import * as FrustumModule from './math/Frustum.js';
import * as TriangleModule from './math/Triangle.js';
import * as Triangle2Module from './math/Triangle2.js';
import * as Line2Module from './math/Line2.js';
import * as Line3Module from './math/Line3.js';
import * as IntersectionModule from './math/Intersection.js';
import * as CapsuleModule from './math/Capsule.js';
import * as CylinderModule from './math/Cylinder.js';
import * as ConeModule from './math/Cone.js';
import * as TorusModule from './math/Torus.js';
import * as BezierModule from './math/Bezier.js';
import * as SplineModule from './math/Spline.js';
import * as BSplineModule from './math/BSpline.js';
import * as NURBSModule from './math/NURBS.js';
import * as HermiteModule from './math/Hermite.js';
import * as CatmullRomModule from './math/CatmullRom.js';
import * as CurvePathModule from './math/CurvePath.js';
import * as SurfaceModule from './math/Surface.js';
import * as InterpolantModule from './math/Interpolant.js';

const LXRN = {
  Accordion: AccordionModule,
  Viewport: ViewportModule,
  App: AppModule,
  MathUtils: MathUtilsModule,
  Vec2: Vec2Module,
  Vec3: Vec3Module,
  Vec4: Vec4Module,
  Mat2: Mat2Module,
  Mat3: Mat3Module,
  Mat4: Mat4Module,
  Matrix: MatrixModule,
  MatrixStack: MatrixStackModule,
  Quat: QuatModule,
  Euler: EulerModule,
  DualQuat: DualQuatModule,
  Complex: ComplexModule,
  Bound2: Bound2Module,
  Bound3: Bound3Module,
  OBB: OBBModule,
  Sphere: SphereModule,
  Plane: PlaneModule,
  Ray: RayModule,
  Frustum: FrustumModule,
  Triangle: TriangleModule,
  Triangle2: Triangle2Module,
  Line2: Line2Module,
  Line3: Line3Module,
  Intersection: IntersectionModule,
  Capsule: CapsuleModule,
  Cylinder: CylinderModule,
  Cone: ConeModule,
  Torus: TorusModule,
  Bezier: BezierModule,
  Spline: SplineModule,
  BSpline: BSplineModule,
  NURBS: NURBSModule,
  Hermite: HermiteModule,
  CatmullRom: CatmullRomModule,
  CurvePath: CurvePathModule,
  Surface: SurfaceModule,
  Interpolant: InterpolantModule
};

export default LXRN;
