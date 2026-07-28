import React, { useState } from 'react';
import { Boxes, Sparkles, Layers, Sliders } from 'lucide-react';
import { BoxGeometry, SphereGeometry, CylinderGeometry, TorusGeometry, TorusKnotGeometry, StandardMaterial, PhongMaterial, Color } from '../../lxrn';

export const GeometriesMaterialsPlayground: React.FC = () => {
  const [geoShape, setGeoShape] = useState<'box' | 'sphere' | 'cylinder' | 'torus' | 'torusKnot'>('torusKnot');
  const [matType, setMatType] = useState<'standard' | 'phong' | 'basic'>('standard');
  const [roughness, setRoughness] = useState<number>(0.3);
  const [metalness, setMetalness] = useState<number>(0.8);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [colorHex, setColorHex] = useState<string>('#6366f1');

  // Compute stats on active geometry
  const getGeoStats = () => {
    let geo;
    if (geoShape === 'box') geo = new BoxGeometry(1, 1, 1);
    else if (geoShape === 'sphere') geo = new SphereGeometry(1, 24, 24);
    else if (geoShape === 'cylinder') geo = new CylinderGeometry(1, 1, 2, 24);
    else if (geoShape === 'torus') geo = new TorusGeometry(1, 0.4, 16, 32);
    else geo = new TorusKnotGeometry(1, 0.3, 64, 16);

    const pos = geo.getAttribute('position');
    const vertices = pos ? pos.count : 0;
    const triangles = geo.index ? geo.index.count / 3 : vertices / 3;

    return { vertices, triangles };
  };

  const { vertices, triangles } = getGeoStats();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-100 text-base">LXRN Geometries & PBR Materials Lab</h3>
          <p className="text-xs text-slate-400 font-mono">Parametric mesh vertex buffers, UV mapping, normals & PBR shading parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span>Geometry & Material Config</span>
          </h4>

          {/* Shape Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Parametric Geometry</label>
            <div className="grid grid-cols-3 gap-2">
              {(['box', 'sphere', 'cylinder', 'torus', 'torusKnot'] as const).map(shape => (
                <button
                  key={shape}
                  onClick={() => setGeoShape(shape)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                    geoShape === shape
                      ? 'bg-pink-600/30 text-pink-300 border-pink-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          {/* Material Type */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Material Shader</label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'phong', 'basic'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setMatType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                    matType === type
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 font-mono text-xs pt-2">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Roughness</span>
                <span>{roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={roughness}
                onChange={e => setRoughness(parseFloat(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Metalness</span>
                <span>{metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={metalness}
                onChange={e => setMetalness(parseFloat(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400">Wireframe Overlay</span>
              <input
                type="checkbox"
                checked={wireframe}
                onChange={e => setWireframe(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Mesh Stats & Evaluation */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 font-mono text-xs">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Buffer Geometry Evaluation</span>
            </h4>

            <div className="space-y-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Vertices Count</span>
                <span className="font-bold text-indigo-400 text-sm">{vertices.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Triangles Count</span>
                <span className="font-bold text-pink-400 text-sm">{triangles.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Attribute Buffers</span>
                <span className="text-slate-200">position (vec3), normal (vec3), uv (vec2)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-pink-500/20 text-slate-300 space-y-1">
            <span className="text-pink-400 font-bold block">PBR Shader Model:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LXRN StandardMaterial uses GGX microfacet specular distribution with Schlick approximation for Fresnel reflection and Disney roughness diffuse term.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
