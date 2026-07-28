import React, { useRef, useEffect, useState } from 'react';
import { Noise, LinearInterpolant, CubicSplineInterpolant } from '../../lxrn';
import { Activity, RefreshCw } from 'lucide-react';

export const InterpolantNoisePlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(42);
  const [octaves, setOctaves] = useState(4);
  const [scale, setScale] = useState(0.04);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = new Noise(seed);
    const width = canvas.width;
    const height = canvas.height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = noise.fbm2D(x * scale, y * scale, octaves);
        const norm = Math.floor((val * 0.5 + 0.5) * 255);
        const idx = (y * width + x) * 4;

        // Colorize heightmap
        data[idx] = Math.min(255, norm * 0.8);
        data[idx + 1] = Math.min(255, norm * 1.1);
        data[idx + 2] = Math.min(255, norm * 1.5);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [seed, octaves, scale]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">LXRN Procedural Noise & Interpolation Engine</h3>
            <p className="text-xs text-slate-400">Generate real-time Fractional Brownian Motion (fBm) noise heightmaps & animation splines</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Seed</span>
              <span className="font-mono">{seed}</span>
            </div>
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 10000))}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs py-1.5 rounded border border-slate-700 flex items-center justify-center space-x-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize Seed</span>
            </button>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>fBm Octaves</span>
              <span className="font-mono">{octaves}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={octaves}
              onChange={e => setOctaves(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Frequency Scale</span>
              <span className="font-mono">{scale.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.005"
              max="0.1"
              step="0.005"
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        {/* Heightmap Canvas */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center">
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            className="rounded-lg shadow-inner border border-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
