import React from 'react';
import { ModuleCategory } from '../types';
import { VERSION } from '../lxrn';
import {
  Box,
  Compass,
  Grid3X3,
  Rotate3d,
  Spline,
  Target,
  Activity,
  Zap,
  BookOpen,
  Layers,
  Boxes,
  Flame
} from 'lucide-react';

interface NavbarProps {
  activeCategory: ModuleCategory;
  onSelectCategory: (cat: ModuleCategory) => void;
  onRunBenchmarks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onRunBenchmarks
}) => {
  const navItems: { id: ModuleCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'vectors', label: 'Vectors (Vec2/3/4)', icon: <Compass className="w-4 h-4" /> },
    { id: 'matrices', label: 'Matrices (Mat2/3/4)', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'quaternions', label: 'Quaternions & DualQuat', icon: <Rotate3d className="w-4 h-4" /> },
    { id: 'curves_surfaces', label: 'Curves & Surfaces', icon: <Spline className="w-4 h-4" /> },
    { id: 'geometry_intersections', label: 'Geometry & Raycast', icon: <Target className="w-4 h-4" /> },
    { id: 'scene_graph', label: 'Scene Graph & Camera', icon: <Layers className="w-4 h-4" /> },
    { id: 'geometries_materials', label: 'Geometries & Materials', icon: <Boxes className="w-4 h-4" /> },
    { id: 'physics_particles', label: 'Physics & Particles', icon: <Flame className="w-4 h-4" /> },
    { id: 'interpolants_noise', label: 'Interpolants & Noise', icon: <Activity className="w-4 h-4" /> },
    { id: 'benchmark', label: 'Benchmark & Tests', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCategory('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
              LX
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  LXRN 3D Engine
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
                  v{VERSION} Full
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Complete 3D Engine, Physics, Math & Graphics Suite
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={onRunBenchmarks}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Run Engine Benchmarks</span>
          </button>
        </div>

        {/* Module Category Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2">
          {navItems.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
