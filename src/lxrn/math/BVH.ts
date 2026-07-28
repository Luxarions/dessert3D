/**
 * LXRN BVH (Bounding Volume Hierarchy for fast raycasting & Spatial Partitioning)
 * @module BVH
 */

import { Bound3 } from './Bound3';
import { Vec3 } from './Vec3';
import { Ray } from './Ray';

export class BVHNode {
  public bounds: Bound3;
  public left: BVHNode | null = null;
  public right: BVHNode | null = null;
  public objectIndices: number[] = [];

  constructor() {
    this.bounds = new Bound3();
  }

  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}

export class BVH {
  public root: BVHNode | null = null;
  public objects: { center: Vec3; bounds: Bound3; id: number }[] = [];

  public build(objects: { center: Vec3; bounds: Bound3; id: number }[]) {
    this.objects = objects;
    if (objects.length === 0) {
      this.root = null;
      return;
    }
    this.root = this.buildNode(0, objects.length - 1);
  }

  private buildNode(start: number, end: number): BVHNode {
    const node = new BVHNode();

    // Compute total bounds
    for (let i = start; i <= end; i++) {
      node.bounds.union(this.objects[i].bounds);
    }

    const count = end - start + 1;
    if (count <= 2) {
      for (let i = start; i <= end; i++) {
        node.objectIndices.push(this.objects[i].id);
      }
      return node;
    }

    // Split on longest axis
    const size = node.bounds.getSize();
    let splitAxis: 'x' | 'y' | 'z' = 'x';
    if (size.y > size.x && size.y > size.z) splitAxis = 'y';
    else if (size.z > size.x && size.z > size.y) splitAxis = 'z';

    // Sort objects along split axis
    const mid = Math.floor((start + end) / 2);
    const slice = this.objects.slice(start, end + 1);
    slice.sort((a, b) => a.center[splitAxis] - b.center[splitAxis]);

    for (let i = 0; i < slice.length; i++) {
      this.objects[start + i] = slice[i];
    }

    node.left = this.buildNode(start, mid);
    node.right = this.buildNode(mid + 1, end);

    return node;
  }

  public raycast(ray: Ray, hits: number[] = []) {
    if (!this.root) return hits;
    this.raycastNode(this.root, ray, hits);
    return hits;
  }

  private raycastNode(node: BVHNode, ray: Ray, hits: number[]) {
    if (!ray.intersectsBox(node.bounds)) return;

    if (node.isLeaf()) {
      hits.push(...node.objectIndices);
    } else {
      if (node.left) this.raycastNode(node.left, ray, hits);
      if (node.right) this.raycastNode(node.right, ray, hits);
    }
  }
}
