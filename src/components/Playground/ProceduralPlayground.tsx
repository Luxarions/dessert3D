import React, { useState } from 'react';
import { Viewport3D } from '../3DCanvas/Viewport3D';
import * as LXRN from '../../lxrn';
import { Sparkles, Mountain, Waves, Building2, Orbit, Flame, ShieldAlert, CloudRain, Zap, Trees, Sun, Wand2, Activity } from 'lucide-react';

type SystemPreset =
  | 'terrain'
  | 'ocean'
  | 'city'
  | 'galaxy'
  | 'explosion'
  | 'portal'
  | 'fire'
  | 'waterfall'
  | 'aurora'
  | 'forest'
  | 'solar'
  | 'lightning'
  | 'magic'
  | 'physics';

export const ProceduralPlayground: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<SystemPreset>('terrain');

  const systemsList: { id: SystemPreset; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'terrain', title: '1. Procedural Terrain', desc: 'Multi-octave Simplex noise heightmap generator', icon: <Mountain className="w-4 h-4 text-emerald-400" /> },
    { id: 'ocean', title: '2. Ocean & Waves', desc: 'Real-time wave deformation plane', icon: <Waves className="w-4 h-4 text-cyan-400" /> },
    { id: 'city', title: '3. City Generator', desc: 'Procedural building block generation algorithm', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
    { id: 'galaxy', title: '4. Galaxy Generator', desc: 'Spiral arm logarithmic particle distribution', icon: <Orbit className="w-4 h-4 text-purple-400" /> },
    { id: 'explosion', title: '5. Explosion Effect', desc: 'Radial velocity particle explosion physics', icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { id: 'portal', title: '6. Portal Effect', desc: 'Swirling ring particle vortex system', icon: <Wand2 className="w-4 h-4 text-fuchsia-400" /> },
    { id: 'fire', title: '7. Fire System', desc: 'Thermal buoyancy particle simulation', icon: <Flame className="w-4 h-4 text-red-400" /> },
    { id: 'waterfall', title: '8. Waterfall', desc: 'Gravity-driven continuous particle fluid', icon: <CloudRain className="w-4 h-4 text-sky-400" /> },
    { id: 'aurora', title: '9. Aurora Effect', desc: 'Atmospheric wave deformation ribbon', icon: <Sparkles className="w-4 h-4 text-teal-400" /> },
    { id: 'forest', title: '10. Forest Generator', desc: 'Randomized procedural tree & trunk scattering', icon: <Trees className="w-4 h-4 text-green-400" /> },
    { id: 'solar', title: '11. Solar System', desc: 'Keplerian orbital motion planetary simulation', icon: <Sun className="w-4 h-4 text-yellow-400" /> },
    { id: 'lightning', title: '12. Lightning Storm', desc: 'Fractal discharge bolt generator', icon: <Zap className="w-4 h-4 text-indigo-400" /> },
    { id: 'magic', title: '13. Magic System', desc: 'Spherical orbital magic particle field', icon: <Wand2 className="w-4 h-4 text-pink-400" /> },
    { id: 'physics', title: '14. Physics Engine', desc: 'Rigid body gravity & sphere collision dynamics', icon: <Activity className="w-4 h-4 text-amber-400" /> },
  ];

  const setupScene = (scene: LXRN.Scene, camera: LXRN.Camera) => {
    scene.children = [];

    const ambient = new LXRN.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sun = new LXRN.DirectionalLight(0xffeedd, 1.2);
    sun.position.set(30, 40, 20);
    scene.add(sun);

    if (selectedSystem === 'terrain') {
      scene.background = new LXRN.Color(0x87ceeb);
      camera.position.set(40, 25, 40);
      camera.lookAt(0, 0, 0);

      const terrain = new LXRN.ProceduralTerrain(80, 80, 128, 8, 0.03);
      scene.add(terrain);
    } else if (selectedSystem === 'ocean') {
      scene.background = new LXRN.Color(0x0a0a2a);
      camera.position.set(30, 15, 30);
      camera.lookAt(0, 0, 0);

      const ocean = new LXRN.Ocean(150, 150, 80);
      scene.add(ocean);
    } else if (selectedSystem === 'city') {
      scene.background = new LXRN.Color(0x1a1a2e);
      camera.position.set(60, 45, 60);
      camera.lookAt(0, 0, 0);

      const city = new LXRN.CityGenerator({ width: 80, depth: 80, blockSize: 8, buildingHeightMax: 35 });
      scene.add(city);
    } else if (selectedSystem === 'galaxy') {
      scene.background = new LXRN.Color(0x000011);
      camera.position.set(30, 18, 30);
      camera.lookAt(0, 0, 0);

      const galaxy = new LXRN.GalaxyGenerator({ count: 12000, arms: 4, radius: 22 });
      scene.add(galaxy);
    } else if (selectedSystem === 'explosion') {
      scene.background = new LXRN.Color(0x111122);
      camera.position.set(10, 5, 15);
      camera.lookAt(0, 0, 0);

      const explosion = new LXRN.Explosion({ count: 800, radius: 8, duration: 2.5 });
      scene.add(explosion);
    } else if (selectedSystem === 'portal') {
      scene.background = new LXRN.Color(0x0a0a1a);
      camera.position.set(0, 0, 6);
      camera.lookAt(0, 0, 0);

      const portal = new LXRN.PortalEffect(2.2, 48);
      scene.add(portal);
    } else if (selectedSystem === 'fire') {
      scene.background = new LXRN.Color(0x1a0a0a);
      camera.position.set(2, 2, 5);
      camera.lookAt(0, 1, 0);

      const fire = new LXRN.FireSystem({ count: 350, spread: 1.5, height: 3 });
      scene.add(fire);
    } else if (selectedSystem === 'waterfall') {
      scene.background = new LXRN.Color(0x0a1a2a);
      camera.position.set(3, 3, 6);
      camera.lookAt(0, 2, 0);

      const waterfall = new LXRN.Waterfall({ count: 1200, height: 5 });
      scene.add(waterfall);
    } else if (selectedSystem === 'aurora') {
      scene.background = new LXRN.Color(0x0a0a1a);
      camera.position.set(30, 15, 30);
      camera.lookAt(0, 5, 0);

      const aurora = new LXRN.Aurora(120, 50, 60);
      scene.add(aurora);
    } else if (selectedSystem === 'forest') {
      scene.background = new LXRN.Color(0x1a2a1a);
      camera.position.set(35, 20, 35);
      camera.lookAt(0, 0, 0);

      const forest = new LXRN.ForestGenerator({ width: 80, depth: 80, treeCount: 400 });
      scene.add(forest);
    } else if (selectedSystem === 'solar') {
      scene.background = new LXRN.Color(0x000000);
      camera.position.set(25, 18, 35);
      camera.lookAt(0, 0, 0);

      const solar = new LXRN.SolarSystem({ planetCount: 8, sunRadius: 2.2 });
      scene.add(solar);
    } else if (selectedSystem === 'lightning') {
      scene.background = new LXRN.Color(0x0a0a12);
      camera.position.set(10, 5, 15);
      camera.lookAt(0, 5, 0);

      const lightning = new LXRN.LightningStorm();
      scene.add(lightning);
    } else if (selectedSystem === 'magic') {
      scene.background = new LXRN.Color(0x0a0a1a);
      camera.position.set(5, 3, 8);
      camera.lookAt(0, 0, 0);

      const magic = new LXRN.MagicSystem({ count: 400, radius: 3.5 });
      scene.add(magic);
    } else if (selectedSystem === 'physics') {
      scene.background = new LXRN.Color(0x222233);
      camera.position.set(10, 8, 15);
      camera.lookAt(0, 2, 0);

      const physics = new LXRN.PhysicsEngine();
      physics.gravity.set(0, -9.81, 0);

      const groundMesh = new LXRN.Mesh(
        new LXRN.PlaneGeometry(20, 20),
        new LXRN.StandardMaterial({ color: 0x445566, roughness: 0.8 })
      );
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = -0.5;
      scene.add(groundMesh);

      const groundBody = new LXRN.PhysicsBody(new LXRN.Vec3(0, -0.5, 0), new LXRN.Vec3(0, 0, 0), 10, Infinity, true);
      physics.addBody(groundBody);

      const sphereMat = new LXRN.StandardMaterial({ color: 0xff8844, roughness: 0.4 });

      const sphereGeo = new LXRN.SphereGeometry(0.5, 16, 16);

      for (let i = 0; i < 12; i++) {
        const mesh = new LXRN.Mesh(sphereGeo, sphereMat);
        const x = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        const y = 2 + Math.random() * 5;
        mesh.position.set(x, y, z);
        scene.add(mesh);

        const body = new LXRN.PhysicsBody(
          new LXRN.Vec3(x, y, z),
          new LXRN.Vec3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2),
          0.5,
          1,
          false
        );
        physics.addBody(body);
      }
    }
  };

  const handleUpdate = (scene: LXRN.Scene, camera: LXRN.Camera, delta: number, totalTime: number) => {
    scene.children.forEach((child) => {
      if ('update' in child && typeof (child as any).update === 'function') {
        (child as any).update(delta, totalTime);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>LXRN Custom Procedural Systems</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Select any of LXRN's built-in custom procedural generators and physics particle systems to render in real-time.
          </p>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {systemsList.map((sys) => {
              const active = selectedSystem === sys.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystem(sys.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start space-x-3 ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">{sys.icon}</div>
                  <div>
                    <div className="text-xs font-semibold">{sys.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{sys.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <Viewport3D onSetup={setupScene} onUpdate={handleUpdate} className="h-[650px] w-full rounded-2xl border border-slate-800 shadow-2xl overflow-hidden" />
      </div>
    </div>
  );
};
