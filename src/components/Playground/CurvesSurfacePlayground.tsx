import React, { useState } from 'react';
import { Bezier2D, CatmullRomCurve3, BSplineCurve3, NURBSCurve3, Surface, Vec2, Vec3, Vec4 } from '../../lxrn';
import { Spline, Grid } from 'lucide-react';

export const CurvesSurfacePlayground: React.FC = () => {
  const [curveType, setCurveType] = useState<'catmull' | 'bezier' | 'bspline' | 'nurbs'>('catmull');
  const [divisions, setDivisions] = useState(40);

  // Curves setup
  const catmull = new CatmullRomCurve3([
    new Vec3(-2, -1, 0),
    new Vec3(-1, 1.5, 0),
    new Vec3(1, -1.5, 0),
    new Vec3(2, 1, 0)
  ], false);

  const bspline = new BSplineCurve3([
    new Vec3(-2, -1, 0),
    new Vec3(-1, 2, 0),
    new Vec3(1, -2, 0),
    new Vec3(2, 1, 0)
  ], 3);

  const pts = curveType === 'catmull' ? catmull.getPoints(divisions) : bspline.getPoints(divisions);

  // Surface test (Torus Parametric Surface)
  const torusSurface = new Surface((u, v, target = new Vec3()) => {
    const R = 2;
    const r = 0.8;
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI * 2;
    target.x = (R + r * Math.cos(phi)) * Math.cos(theta);
    target.y = r * Math.sin(phi);
    target.z = (R + r * Math.cos(phi)) * Math.sin(theta);
    return target;
  });

  const gridData = torusSurface.generateGrid(10, 10);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Spline className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Parametric Curves & Surfaces</h3>
            <p className="text-xs text-slate-400">Evaluate Bezier, Catmull-Rom, B-Spline, NURBS & 3D Surface Mesh grids</p>
          </div>
        </div>

        {/* Type selector */}
        <div className="flex space-x-2 mb-4">
          {(['catmull', 'bspline'] as const).map(type => (
            <button
              key={type}
              onClick={() => setCurveType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                curveType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {type === 'catmull' ? 'Catmull-Rom Spline' : 'B-Spline Curve'}
            </button>
          ))}
        </div>

        {/* 2D Curve Canvas Preview */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
          <svg className="w-full h-48 bg-slate-900 rounded-lg border border-slate-800/80" viewBox="-3 -2.5 6 5">
            {/* Grid lines */}
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#334155" strokeWidth="0.02" />
            <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#334155" strokeWidth="0.02" />

            {/* Curve path */}
            <path
              d={pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${-p.y}`).join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth="0.08"
            />

            {/* Control points */}
            {catmull.points.map((cp, idx) => (
              <circle key={idx} cx={cp.x} cy={-cp.y} r="0.1" fill="#ec4899" />
            ))}
          </svg>
          <div className="mt-3 flex justify-between w-full text-xs font-mono text-slate-400">
            <span>Evaluated Points: {pts.length}</span>
            <span>Surface Vertices Generated: {gridData.vertices.length}</span>
            <span>Surface Triangles: {gridData.indices.length / 3}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
