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
import { SceneGraphPlayground } from './components/Playground/SceneGraphPlayground';
import { GeometriesMaterialsPlayground } from './components/Playground/GeometriesMaterialsPlayground';
import { PhysicsParticlesPlayground } from './components/Playground/PhysicsParticlesPlayground';
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
  Cpu,
  Layers,
  Sparkles,
  Flame
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
                Live 3D LXRN Viewport Evaluator
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
                  onClick={() => setActiveCategory('scene_graph')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Scene Graph & Cameras</h3>
                  <p className="text-xs text-slate-400">
                    Object3D tree nodes, Perspective & Orthographic Cameras, Raycasters & OrbitControls.
                  </p>
                </div>

                <div
                  onClick={() => setActiveCategory('physics_particles')}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">Physics & Particles</h3>
                  <p className="text-xs text-slate-400">
                    RigidBody dynamics solver, impulse collision resolution & 3D particle emitter system.
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
                    <h3 className="text-base font-bold text-slate-100">LXRN 3D Engine Complete Architecture</h3>
                    <p className="text-xs text-slate-400">High-Performance Zero-Allocation TypedArray Engine & Math Suite</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">⚡ Core & Renderers</span>
                    WebGLRenderer, Object3D hierarchy, Perspective & Orthographic cameras, EventDispatcher & Clock.
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-pink-400 font-bold block mb-1">🎯 Geometries & Materials</span>
                    Box, Sphere, TorusKnot, Cylinder geometries, PBR StandardMaterial, Phong, Lambert & ShaderMaterial.
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-1">🔥 Physics & Loaders</span>
                    Impulse physics solver, RigidBody collisions, ParticleSystem, OBJLoader, STLLoader & OrbitControls.
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
          {activeCategory === 'scene_graph' && <SceneGraphPlayground />}
          {activeCategory === 'geometries_materials' && <GeometriesMaterialsPlayground />}
          {activeCategory === 'physics_particles' && <PhysicsParticlesPlayground />}
          {activeCategory === 'interpolants_noise' && <InterpolantNoisePlayground />}
          {activeCategory === 'benchmark' && <BenchmarkSuite />}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
          <span>LXRN 3D Engine v{VERSION} — Full Engine & Graphics Port</span>
          <span className="text-slate-500 mt-2 sm:mt-0">Powered by TypeScript, WebGL & Canvas2D Math Engine</span>
        </div>
      </footer>
    </div>
  );
}
