import React, { useRef, useEffect, useState } from 'react';
import { Mat4, Vec3, Quat, Bound3, OBB, Sphere, Bezier3D, CatmullRomCurve3, Torus, Ray } from '../../lxrn';
import { RotateCw, Move, Eye, RefreshCw } from 'lucide-react';

interface Viewport3DProps {
  demoMode?: 'cube' | 'obb' | 'sphere' | 'curve' | 'surface' | 'raycast';
  autoRotate?: boolean;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  demoMode = 'cube',
  autoRotate: initialAutoRotate = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [cameraDistance, setCameraDistance] = useState(5);
  const [rotation, setRotation] = useState({ x: 0.4, y: 0.6 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [hoverPoint, setHoverPoint] = useState<Vec3 | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotY = rotation.y;

    const render = () => {
      if (autoRotate && !isDragging) {
        rotY += 0.01;
        setRotation(r => ({ ...r, y: rotY }));
      }

      // Handle canvas resizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Clear background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Build LXRN Camera Matrices
      const aspect = width / height;
      const fov = 45 * Math.PI / 180;
      const near = 0.1;
      const far = 100;

      const projMatrix = new Mat4().makePerspective(-aspect * Math.tan(fov/2) * near, aspect * Math.tan(fov/2) * near, Math.tan(fov/2) * near, -Math.tan(fov/2) * near, near, far);

      // Camera position from spherical coordinates
      const eyeX = cameraDistance * Math.sin(rotation.y) * Math.cos(rotation.x);
      const eyeY = cameraDistance * Math.sin(rotation.x);
      const eyeZ = cameraDistance * Math.cos(rotation.y) * Math.cos(rotation.x);

      const eye = new Vec3(eyeX, eyeY, eyeZ);
      const target = new Vec3(0, 0, 0);
      const up = new Vec3(0, 1, 0);

      const viewMatrix = new Mat4().lookAt(eye, target, up).invert();
      const viewProj = new Mat4().multiplyMatrices(projMatrix, viewMatrix);

      // Function to project 3D point to 2D Screen Canvas using LXRN Mat4
      const project = (v: Vec3): { x: number; y: number; visible: boolean } => {
        const p = v.clone().applyMat4(viewProj);
        const x = (p.x + 1) * 0.5 * width;
        const y = (1 - p.y) * 0.5 * height;
        return { x, y, visible: p.z >= -1 && p.z <= 1 };
      };

      // Draw 3D Coordinate Grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#334155';
      const gridSize = 10;
      const gridStep = 0.5;

      for (let i = -gridSize; i <= gridSize; i++) {
        const p1 = project(new Vec3(i * gridStep, 0, -gridSize * gridStep));
        const p2 = project(new Vec3(i * gridStep, 0, gridSize * gridStep));
        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        const p3 = project(new Vec3(-gridSize * gridStep, 0, i * gridStep));
        const p4 = project(new Vec3(gridSize * gridStep, 0, i * gridStep));
        if (p3.visible && p4.visible) {
          ctx.beginPath();
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();
        }
      }

      // Draw RGB Coordinate Axes
      const origin = project(new Vec3(0, 0, 0));
      const xAxis = project(new Vec3(1, 0, 0));
      const yAxis = project(new Vec3(0, 1, 0));
      const zAxis = project(new Vec3(0, 0, 1));

      const drawAxis = (p: { x: number; y: number }, color: string, label: string) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.font = '10px monospace';
        ctx.fillText(label, p.x + 4, p.y + 4);
      };

      drawAxis(xAxis, '#ef4444', 'X');
      drawAxis(yAxis, '#22c55e', 'Y');
      drawAxis(zAxis, '#3b82f6', 'Z');

      // Render Active Demo Object
      if (demoMode === 'cube') {
        // Render 3D Rotating Cube with Bound3/OBB
        const vertices = [
          new Vec3(-1, -1, -1), new Vec3(1, -1, -1),
          new Vec3(1, 1, -1), new Vec3(-1, 1, -1),
          new Vec3(-1, -1, 1), new Vec3(1, -1, 1),
          new Vec3(1, 1, 1), new Vec3(-1, 1, 1)
        ];

        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        edges.forEach(([i, j]) => {
          const p1 = project(vertices[i]);
          const p2 = project(vertices[j]);
          if (p1.visible && p2.visible) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Highlight vertices
        vertices.forEach(v => {
          const p = project(v);
          if (p.visible) {
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else if (demoMode === 'sphere' || demoMode === 'obb') {
        // Render Wireframe Sphere or Torus
        const uSteps = 16;
        const vSteps = 12;
        const radius = 1.2;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;

        for (let i = 0; i < uSteps; i++) {
          const theta1 = (i / uSteps) * Math.PI * 2;
          const theta2 = ((i + 1) / uSteps) * Math.PI * 2;

          for (let j = 0; j < vSteps; j++) {
            const phi1 = (j / vSteps) * Math.PI - Math.PI / 2;
            const phi2 = ((j + 1) / vSteps) * Math.PI - Math.PI / 2;

            const p1 = new Vec3(radius * Math.cos(phi1) * Math.cos(theta1), radius * Math.sin(phi1), radius * Math.cos(phi1) * Math.sin(theta1));
            const p2 = new Vec3(radius * Math.cos(phi1) * Math.cos(theta2), radius * Math.sin(phi1), radius * Math.cos(phi1) * Math.sin(theta2));
            const p3 = new Vec3(radius * Math.cos(phi2) * Math.cos(theta1), radius * Math.sin(phi2), radius * Math.cos(phi2) * Math.sin(theta1));

            const proj1 = project(p1);
            const proj2 = project(p2);
            const proj3 = project(p3);

            if (proj1.visible && proj2.visible) {
              ctx.beginPath();
              ctx.moveTo(proj1.x, proj1.y);
              ctx.lineTo(proj2.x, proj2.y);
              ctx.stroke();
            }
            if (proj1.visible && proj3.visible) {
              ctx.beginPath();
              ctx.moveTo(proj1.x, proj1.y);
              ctx.lineTo(proj3.x, proj3.y);
              ctx.stroke();
            }
          }
        }
      } else if (demoMode === 'curve') {
        // Render LXRN CatmullRom 3D Curve
        const curve = new CatmullRomCurve3([
          new Vec3(-1.5, 0, -1),
          new Vec3(-0.5, 1.2, 0.5),
          new Vec3(0.8, -0.8, -0.5),
          new Vec3(1.5, 0.5, 1)
        ], false);

        const pts = curve.getPoints(80);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.beginPath();

        pts.forEach((pt, idx) => {
          const p = project(pt);
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Control points
        curve.points.forEach((cp, idx) => {
          const p = project(cp);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText(`P${idx}`, p.x + 8, p.y - 4);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate, cameraDistance, rotation, isDragging, demoMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation(r => ({
      x: Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, r.x + dy * 0.008)),
      y: r.y + dx * 0.008
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    setCameraDistance(d => Math.max(2, Math.min(15, d + e.deltaY * 0.005)));
  };

  return (
    <div className="relative w-full h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Control Overlay */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
        <Eye className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-mono">
          Dist: {cameraDistance.toFixed(1)}m | Rot: ({(rotation.x * 180 / Math.PI).toFixed(0)}°, {(rotation.y * 180 / Math.PI % 360).toFixed(0)}°)
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${
            autoRotate
              ? 'bg-indigo-600/80 text-white border-indigo-400/50 shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="Toggle Auto Orbit"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => { setRotation({ x: 0.4, y: 0.6 }); setCameraDistance(5); }}
          className="p-2 rounded-lg text-xs bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-white backdrop-blur-md transition-all"
          title="Reset Camera View"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mouse Guide */}
      <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
        🖱️ Drag to orbit | Scroll to zoom
      </div>
    </div>
  );
};
