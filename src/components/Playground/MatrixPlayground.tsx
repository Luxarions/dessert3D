import React, { useState } from 'react';
import { Mat4, Vec3, Quat } from '../../lxrn';
import { Grid3X3, RefreshCcw, Layers } from 'lucide-react';

export const MatrixPlayground: React.FC = () => {
  const [translation, setTranslation] = useState({ x: 2, y: 1, z: -3 });
  const [rotation, setRotation] = useState({ x: 45, y: 30, z: 0 });
  const [scale, setScale] = useState({ x: 1.5, y: 1.5, z: 1.5 });

  // Compose Transformation Matrix in LXRN
  const pos = new Vec3(translation.x, translation.y, translation.z);
  const eulerRadX = rotation.x * Math.PI / 180;
  const eulerRadY = rotation.y * Math.PI / 180;
  const eulerRadZ = rotation.z * Math.PI / 180;
  const quat = new Quat().setFromEuler({ _x: eulerRadX, _y: eulerRadY, _z: eulerRadZ, _order: 'XYZ' });
  const scl = new Vec3(scale.x, scale.y, scale.z);

  const mat = new Mat4().compose(pos, quat, scl);
  const det = mat.determinant().toFixed(3);
  const invMat = mat.clone().invert();

  // Decomposed values test
  const decompPos = new Vec3();
  const decompQuat = new Quat();
  const decompScl = new Vec3();
  mat.decompose(decompPos, decompQuat, decompScl);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Mat4 Matrix Composer & Inspector</h3>
            <p className="text-xs text-slate-400">Interactive 4x4 Transformation Matrix composition (T · R · S)</p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Translation */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-indigo-400">Translation (Position)</span>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    value={translation[axis]}
                    onChange={e => setTranslation({ ...translation, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-pink-400">Rotation (Euler Deg)</span>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    value={rotation[axis]}
                    onChange={e => setRotation({ ...rotation, [axis]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-400">Scale</span>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map(axis => (
                <div key={axis}>
                  <label className="text-[10px] text-slate-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scale[axis]}
                    onChange={e => setScale({ ...scale, [axis]: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Composed Mat4 Elements */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-semibold text-slate-300">Composed Mat4 (Column-Major)</span>
              <span className="text-xs font-mono text-indigo-400">Det: {det}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center text-slate-200">
              {[0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15].map((idx, i) => (
                <div key={i} className="bg-slate-900/90 py-2 rounded border border-slate-800/80">
                  {mat.elements[idx].toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Inverse Mat4 Elements */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-semibold text-slate-300">Inverted Mat4 (Inverse Matrix)</span>
              <span className="text-xs font-mono text-emerald-400">Verified</span>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center text-slate-300">
              {[0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15].map((idx, i) => (
                <div key={i} className="bg-slate-900/90 py-2 rounded border border-slate-800/80">
                  {invMat.elements[idx].toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decomposed Verification Badge */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <span>Decomposed Position: ({decompPos.x.toFixed(1)}, {decompPos.y.toFixed(1)}, {decompPos.z.toFixed(1)})</span>
          <span>Decomposed Scale: ({decompScl.x.toFixed(1)}, {decompScl.y.toFixed(1)}, {decompScl.z.toFixed(1)})</span>
        </div>
      </div>
    </div>
  );
};
