import React, { useState } from 'react';
import { Vec2, Vec3, Vec4 } from '../../lxrn';
import { Compass, ArrowRight, CheckCircle2, Copy } from 'lucide-react';

export const VectorPlayground: React.FC = () => {
  // Vec3 State
  const [v1, setV1] = useState({ x: 3, y: 4, z: 0 });
  const [v2, setV2] = useState({ x: 0, y: 5, z: 2 });
  const [lerpAlpha, setLerpAlpha] = useState(0.5);

  const vecA = new Vec3(v1.x, v1.y, v1.z);
  const vecB = new Vec3(v2.x, v2.y, v2.z);

  const dot = vecA.dot(vecB);
  const cross = vecA.clone().cross(vecB);
  const angleRad = vecA.angleTo(vecB);
  const angleDeg = (angleRad * 180 / Math.PI).toFixed(2);
  const distance = vecA.distanceTo(vecB).toFixed(2);
  const lerpRes = vecA.clone().lerp(vecB, lerpAlpha);
  const proj = vecA.clone().projectOnVector(vecB);
  const reflect = vecA.clone().reflect(vecB.clone().normalize());

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Vec3 Interactive Operations</h3>
            <p className="text-xs text-slate-400">Perform real-time vector algebra using LXRN.Vec3 methods</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vector A Input */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="text-indigo-400 font-mono">Vector A (v1)</span>
              <span className="font-mono text-slate-500">Length: {vecA.length().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase font-bold">{axis}</label>
                  <input
                    type="number"
                    value={v1[axis]}
                    onChange={e => setV1({ ...v1, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vector B Input */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="text-pink-400 font-mono">Vector B (v2)</span>
              <span className="font-mono text-slate-500">Length: {vecB.length().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase font-bold">{axis}</label>
                  <input
                    type="number"
                    value={v2[axis]}
                    onChange={e => setV2({ ...v2, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:border-pink-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider for Lerp */}
        <div className="mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-4">
          <span className="text-xs text-slate-400 font-mono">Lerp Factor (t): {lerpAlpha.toFixed(2)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={lerpAlpha}
            onChange={e => setLerpAlpha(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
        </div>
      </div>

      {/* Real-time Evaluated Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Dot Product (A · B)</span>
          <p className="text-xl font-mono font-bold text-indigo-400">{dot}</p>
          <span className="text-[10px] text-slate-500 block">Scalar value measuring directional alignment</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Cross Product (A × B)</span>
          <p className="text-sm font-mono font-bold text-pink-400">
            ({cross.x.toFixed(2)}, {cross.y.toFixed(2)}, {cross.z.toFixed(2)})
          </p>
          <span className="text-[10px] text-slate-500 block">Perpendicular normal vector</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Angle Between</span>
          <p className="text-xl font-mono font-bold text-emerald-400">{angleDeg}°</p>
          <span className="text-[10px] text-slate-500 block">{angleRad.toFixed(4)} radians</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Distance Between</span>
          <p className="text-xl font-mono font-bold text-sky-400">{distance}</p>
          <span className="text-[10px] text-slate-500 block">Euclidean metric</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Linear Interpolation (Lerp)</span>
          <p className="text-sm font-mono font-bold text-amber-400">
            ({lerpRes.x.toFixed(2)}, {lerpRes.y.toFixed(2)}, {lerpRes.z.toFixed(2)})
          </p>
          <span className="text-[10px] text-slate-500 block">A + (B - A) * {lerpAlpha}</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Project A on B</span>
          <p className="text-sm font-mono font-bold text-violet-400">
            ({proj.x.toFixed(2)}, {proj.y.toFixed(2)}, {proj.z.toFixed(2)})
          </p>
          <span className="text-[10px] text-slate-500 block">Vector component along B</span>
        </div>
      </div>
    </div>
  );
};
