import React, { useState } from 'react';
import { Quat, DualQuat, Vec3, Euler } from '../../lxrn';
import { Rotate3d, Play, Activity } from 'lucide-react';

export const QuaternionPlayground: React.FC = () => {
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [roll, setRoll] = useState(0);
  const [slerpProgress, setSlerpProgress] = useState(0.5);

  // Euler vs Quat conversion
  const euler = new Euler(pitch * Math.PI / 180, yaw * Math.PI / 180, roll * Math.PI / 180, 'XYZ');
  const quat = new Quat().setFromEuler(euler);

  // Slerp Demonstration between qStart & qTarget
  const qStart = new Quat(0, 0, 0, 1);
  const qEnd = quat.clone();
  const qSlerp = qStart.clone().slerp(qEnd, slerpProgress);

  // Dual Quaternion Rigid Transformation
  const trans = new Vec3(2, 0, -1);
  const dq = new DualQuat().setFromRotationTranslation(qSlerp, trans);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Rotate3d className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Quaternion & Dual Quaternion Studio</h3>
            <p className="text-xs text-slate-400">Gimbal-lock-free 3D rotations, SLERP, and dual quaternion rigid transformations</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold text-indigo-400">Pitch (X)</span>
              <span className="font-mono">{pitch}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold text-pink-400">Yaw (Y)</span>
              <span className="font-mono">{yaw}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={yaw}
              onChange={e => setYaw(parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Roll (Z)</span>
              <span className="font-mono">{roll}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={roll}
              onChange={e => setRoll(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Slerp Slider */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-6 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="font-semibold text-amber-400">Spherical Linear Interpolation (SLERP) t</span>
            <span className="font-mono">{(slerpProgress * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={slerpProgress}
            onChange={e => setSlerpProgress(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Output values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Quaternion (x, y, z, w)</span>
            <p className="text-xs font-mono font-bold text-indigo-400">
              ({quat.x.toFixed(3)}, {quat.y.toFixed(3)}, {quat.z.toFixed(3)}, {quat.w.toFixed(3)})
            </p>
            <span className="text-[10px] text-slate-500 block">Unit quaternion encoding 3D rotation</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">SLERP Result (t={slerpProgress})</span>
            <p className="text-xs font-mono font-bold text-amber-400">
              ({qSlerp.x.toFixed(3)}, {qSlerp.y.toFixed(3)}, {qSlerp.z.toFixed(3)}, {qSlerp.w.toFixed(3)})
            </p>
            <span className="text-[10px] text-slate-500 block">Constant angular velocity path</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Dual Quaternion (Real | Dual)</span>
            <p className="text-xs font-mono font-bold text-emerald-400">
              R: ({dq.real.x.toFixed(2)}, {dq.real.w.toFixed(2)}) | D: ({dq.dual.x.toFixed(2)}, {dq.dual.w.toFixed(2)})
            </p>
            <span className="text-[10px] text-slate-500 block">Joint rotation + translation vector</span>
          </div>
        </div>
      </div>
    </div>
  );
};
