import React, { useState } from 'react';
import { Bound3, OBB, Sphere, Ray, Vec3, Mat4, BVH } from '../../lxrn';
import { Target, Shield, Zap } from 'lucide-react';

export const GeometryIntersectPlayground: React.FC = () => {
  const [rayOrigin, setRayOrigin] = useState({ x: 0, y: 0, z: 5 });
  const [rayDir, setRayDir] = useState({ x: 0, y: 0, z: -1 });

  const ray = new Ray(
    new Vec3(rayOrigin.x, rayOrigin.y, rayOrigin.z),
    new Vec3(rayDir.x, rayDir.y, rayDir.z).normalize()
  );

  // Target Objects
  const sphere = new Sphere(new Vec3(0, 0, 0), 1.5);
  const bound = new Bound3(new Vec3(-1, -1, -1), new Vec3(1, 1, 1));
  const obb = new OBB(new Vec3(0, 0, 0), new Vec3(1, 1, 1));

  // Raycast calculations
  const sphereHit = ray.intersectSphere(sphere);
  const boundHit = ray.intersectBox(bound);

  // BVH Acceleration test
  const bvh = new BVH();
  bvh.build([
    { id: 1, center: new Vec3(0, 0, 0), bounds: bound },
    { id: 2, center: new Vec3(2, 2, 0), bounds: new Bound3(new Vec3(1, 1, -1), new Vec3(3, 3, 1)) }
  ]);

  const bvhHits = bvh.raycast(ray);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Geometry, Raycasting & BVH Inspector</h3>
            <p className="text-xs text-slate-400">Evaluate Ray vs Sphere/AABB/OBB intersections & BVH acceleration trees</p>
          </div>
        </div>

        {/* Ray Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-indigo-400">Ray Origin (P0)</span>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    value={rayOrigin[axis]}
                    onChange={e => setRayOrigin({ ...rayOrigin, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-pink-400">Ray Direction (V)</span>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    value={rayDir[axis]}
                    onChange={e => setRayDir({ ...rayDir, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intersections Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${sphereHit ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-950 border-slate-800'}`}>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Ray vs Sphere (Radius 1.5)</span>
            <p className={`text-base font-bold font-mono ${sphereHit ? 'text-emerald-400' : 'text-slate-500'}`}>
              {sphereHit ? `HIT @ (${sphereHit.x.toFixed(2)}, ${sphereHit.y.toFixed(2)}, ${sphereHit.z.toFixed(2)})` : 'MISS'}
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${boundHit ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-950 border-slate-800'}`}>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Ray vs AABB Bound3</span>
            <p className={`text-base font-bold font-mono ${boundHit ? 'text-indigo-400' : 'text-slate-500'}`}>
              {boundHit ? `HIT @ (${boundHit.x.toFixed(2)}, ${boundHit.y.toFixed(2)}, ${boundHit.z.toFixed(2)})` : 'MISS'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">BVH Tree Hits</span>
            <p className="text-base font-bold font-mono text-amber-400">
              {bvhHits.length > 0 ? `Objects Hit IDs: [${bvhHits.join(', ')}]` : 'No BVH Hits'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
