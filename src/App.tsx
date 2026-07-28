import React, { useState } from 'react';
import { ModuleCategory } from './types';
import { Navbar } from './components/Navbar';
import { Viewport3D } from './components/3DCanvas/Viewport3D';
import { VectorPlayground } from './components/Playground/VectorPlayground';
import { MatrixPlayground } from './components/Playground/MatrixPlayground';
import { QuaternionPlayground } from './components/Playground/QuaternionPlayground';
import { CurvesSurfacePlayground } from './components/Playground/CurvesSurfacePlayground';
import { GeometryIntersectPlayground } from './components/Playground/GeometryIntersectPlayground';
import { InterpolantNoisePlayground } from './components/Playground/InterpolantNoisePlayground';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { VERSION } from './lxrn';
import {
  BookOpen,
  Compass,
  Grid3X3,
  Rotate3d,
  Spline,
  Target,
  Activity,
  Zap,
  Boxes,
  Code2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ModuleCategory>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Navbar Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onRunBenchmarks={() => setActiveCategory('benchmark')}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Interactive 3D Canvas Hero Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Live 3D Math Viewport Evaluator
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Rendered directly using LXRN Mat4 & Vec3 projection
            </span>
          </div>

          <Viewport3D
            demoMode={
              activeCategory === 'vectors' ? 'cube' :
              activeCategory === 'quaternions' ? 'obb' :
              activeCategory === 'curves_surfaces' ? 'curve' :
              activeCategory === 'geometry_intersections' ? 'sphere' : 'cube'
            }
          />
        </section>

        {/* Dynamic Category Playground Views */}
        <section>
          {activeCategory === 'overview' && (
            <div className="space-y-6">
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveCategory('vectors')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Vectors (2D / 3D / 4D)</h3>
                  <p className="text-xs text-slate-400">
                    Vec2, Vec3, Vec4 array operations, dot/cross products, projections, reflections & lerp.
                  </p>
                </div>

                <div
                  onClick={() => setActiveCategory('matrices')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Grid3X3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Matrices & Stack</h3>
                  <p className="text-xs text-slate-400">
                    Mat2, Mat3, Mat4 4x4 matrix decomposition, determinants, inversion & MatrixStack hierarchy.
                  </p>
                </div>

                <div
                  onClick={() => setActiveCategory('quaternions')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Rotate3d className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Quaternions & DualQuat</h3>
                  <p className="text-xs text-slate-400">
                    Gimbal-lock-free 3D rotations, SLERP interpolation & Dual Quaternion rigid transforms.
                  </p>
                </div>

                <div
                  onClick={() => setActiveCategory('curves_surfaces')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Spline className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Curves & Surfaces</h3>
                  <p className="text-xs text-slate-400">
                    Bezier, Catmull-Rom, B-Spline, NURBS & 3D parametric surface mesh generators.
                  </p>
                </div>
              </div>

              {/* Architecture Details */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">LXRN Engine Architecture Overview</h3>
                    <p className="text-xs text-slate-400">High-Performance Zero-Allocation TypedArray Math Library</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">⚡ Float32Array Memory</span>
                    High-performance contiguous float buffers for matrices & vectors to optimize GPU memory layout.
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-pink-400 font-bold block mb-1">🎯 Bounding & Raycasting</span>
                    Full spatial acceleration using BVH trees, AABB Bound3, OBB, Spheres & analytical ray-triangle hits.
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">📐 Parametric & Noise</span>
                    Perlin/fBm noise heightmaps, Hermite splines, NURBS curves & 3D parametric surface evaluators.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'vectors' && <VectorPlayground />}
          {activeCategory === 'matrices' && <MatrixPlayground />}
          {activeCategory === 'quaternions' && <QuaternionPlayground />}
          {activeCategory === 'curves_surfaces' && <CurvesSurfacePlayground />}
          {activeCategory === 'geometry_intersections' && <GeometryIntersectPlayground />}
          {activeCategory === 'interpolants_noise' && <InterpolantNoisePlayground />}
          {activeCategory === 'benchmark' && <BenchmarkSuite />}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
          <span>LXRN Math Library v{VERSION} — Integrated 3D Math Port</span>
          <span className="text-slate-500 mt-2 sm:mt-0">Powered by TypeScript & WebGL/Canvas2D Math Projection</span>
        </div>
      </footer>
    </div>
  );
}
