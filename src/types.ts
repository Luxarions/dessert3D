export type ModuleCategory =
  | 'overview'
  | 'vectors'
  | 'matrices'
  | 'quaternions'
  | 'curves_surfaces'
  | 'geometry_intersections'
  | 'interpolants_noise'
  | 'scene_graph'
  | 'geometries_materials'
  | 'physics_particles'
  | 'benchmark';


export interface BenchmarkResult {
  name: string;
  category: string;
  opsPerSec: number;
  timeMs: number;
  status: 'passed' | 'running' | 'idle';
}

export interface UnitTestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
}
