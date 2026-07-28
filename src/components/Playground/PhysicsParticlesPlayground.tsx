import React, { useState, useEffect } from 'react';
import { Flame, Play, RefreshCw, Zap, Cpu } from 'lucide-react';
import { PhysicsWorld, RigidBody, ParticleSystem, Vec3 } from '../../lxrn';

export const PhysicsParticlesPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'physics' | 'particles'>('physics');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [stepCount, setStepCount] = useState<number>(0);

  // Rigid bodies simulation state
  const [bodies, setBodies] = useState<Array<{ id: number; pos: string; vel: string }>>([]);

  // Particle count
  const [particleCount, setParticleCount] = useState<number>(250);

  useEffect(() => {
    // Initialize sample physics bodies
    const world = new PhysicsWorld();
    const b1 = new RigidBody(1.0);
    b1.position.set(0, 5, 0);
    const b2 = new RigidBody(2.0);
    b2.position.set(0.1, 8, 0);
    const floor = new RigidBody(0); // static
    floor.position.set(0, 0, 0);

    world.addBody(b1);
    world.addBody(b2);
    world.addBody(floor);

    let frameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (isRunning) {
        world.step(0.016);
        if (time - lastTime > 60) {
          lastTime = time;
          setStepCount(prev => prev + 1);
          setBodies(
            world.bodies.map(b => ({
              id: b.id,
              pos: `(${b.position.x.toFixed(2)}, ${b.position.y.toFixed(2)}, ${b.position.z.toFixed(2)})`,
              vel: `(${b.velocity.x.toFixed(2)}, ${b.velocity.y.toFixed(2)}, ${b.velocity.z.toFixed(2)})`
            }))
          );
        }
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">LXRN Physics & Particle Simulation Engine</h3>
            <p className="text-xs text-slate-400 font-mono">Impulse-based rigid body dynamics solver & GPU billboard particles</p>
          </div>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isRunning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-600 text-white'
          }`}
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause Simulation' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('physics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            activeTab === 'physics'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Rigid Body Solver (GJK & Collision Resolution)
        </button>
        <button
          onClick={() => setActiveTab('particles')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            activeTab === 'particles'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          3D Particle Emitter & Dynamics
        </button>
      </div>

      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Bodies list */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Active Rigid Bodies in World</span>
            </h4>

            <div className="space-y-2">
              {bodies.map((b, index) => (
                <div key={b.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300 font-bold">
                    <span>Body #{index + 1} (ID: {b.id})</span>
                    <span className="text-amber-400">{index === 2 ? 'STATIC FLOOR' : 'DYNAMIC'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Pos: {b.pos}</span>
                    <span>Vel: {b.vel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solver Stats */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Physics Solver State</span>
            </h4>

            <div className="space-y-2 text-slate-300">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 flex justify-between">
                <span>Simulation Step</span>
                <span className="font-bold text-amber-400">#{stepCount}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 flex justify-between">
                <span>Gravity Vector</span>
                <span>(0.00, -9.81, 0.00) m/s²</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 flex justify-between">
                <span>Substep Delta Time</span>
                <span>16.6 ms (60 Hz)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'particles' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>Live Particles Count: <strong className="text-amber-400">{particleCount}</strong></span>
            <span>Emitter Rate: 100 particles/sec</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Particle Capacity</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={particleCount}
              onChange={e => setParticleCount(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-400 leading-relaxed text-[11px]">
            <span className="text-amber-400 font-bold block mb-1">Particle Dynamics Architecture:</span>
            LXRN ParticleSystem manages position, velocity, life span, size attenuation, and color gradients over time using Float32Array interleaved buffer attributes for zero-allocation performance.
          </div>
        </div>
      )}
    </div>
  );
};
