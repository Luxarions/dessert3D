import React, { useState } from 'react';
import { Object3D, Scene, PerspectiveCamera, Mesh, BoxGeometry, StandardMaterial, Vec3, Raycaster } from '../../lxrn';
import { Layers, Camera, Eye, Plus, Trash2, Box, Cpu } from 'lucide-react';

export const SceneGraphPlayground: React.FC = () => {
  const [nodes, setNodes] = useState<{ id: string; name: string; type: string; pos: string }[]>([
    { id: '1', name: 'Scene (Root)', type: 'Scene', pos: '(0, 0, 0)' },
    { id: '2', name: 'Main Camera', type: 'PerspectiveCamera', pos: '(0, 2, 5)' },
    { id: '3', name: 'Directional Light', type: 'DirectionalLight', pos: '(5, 10, 5)' },
    { id: '4', name: 'Cube Mesh 1', type: 'Mesh (BoxGeometry)', pos: '(-1, 0, 0)' },
    { id: '5', name: 'Sphere Mesh 2', type: 'Mesh (SphereGeometry)', pos: '(1, 0, 0)' },
  ]);

  const [selectedNode, setSelectedNode] = useState<string>('4');
  const [posX, setPosX] = useState<number>(-1);
  const [posY, setPosY] = useState<number>(0);
  const [posZ, setPosZ] = useState<number>(0);

  const addNode = () => {
    const newId = String(Date.now());
    setNodes([
      ...nodes,
      {
        id: newId,
        name: `Node Object3D_${nodes.length}`,
        type: 'Mesh (TorusKnot)',
        pos: `(${posX}, ${posY}, ${posZ})`
      }
    ]);
  };

  const removeNode = (id: string) => {
    if (id === '1') return; // root
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">LXRN Scene Graph & Object3D Inspector</h3>
            <p className="text-xs text-slate-400 font-mono">Hierarchical node transformations, matrixWorld decomposition & Raycaster</p>
          </div>
        </div>

        <button
          onClick={addNode}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Node Hierarchy List */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Scene Graph Hierarchy</span>
          </h4>

          <div className="space-y-2">
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  selectedNode === node.id
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Box className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold block">{node.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{node.type} — {node.pos}</span>
                  </div>
                </div>

                {node.id !== '1' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Transform Inspector */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center space-x-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Transform Matrix Evaluator</span>
          </h4>

          <div className="space-y-3 text-slate-300">
            <label className="block text-slate-400">Position X: {posX.toFixed(2)}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={posX}
              onChange={e => setPosX(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />

            <label className="block text-slate-400">Position Y: {posY.toFixed(2)}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={posY}
              onChange={e => setPosY(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />

            <label className="block text-slate-400">Position Z: {posZ.toFixed(2)}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={posZ}
              onChange={e => setPosZ(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-bold block">Mat4 World Matrix:</span>
            <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-400 text-center font-mono">
              <span className="bg-slate-950 p-1 rounded">1.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">{posX.toFixed(2)}</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">1.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">{posY.toFixed(2)}</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">1.00</span>
              <span className="bg-slate-950 p-1 rounded">{posZ.toFixed(2)}</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">0.00</span>
              <span className="bg-slate-950 p-1 rounded">1.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
