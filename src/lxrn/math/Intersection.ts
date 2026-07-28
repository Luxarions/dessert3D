/**
 * LXRN Intersection Utilities
 * @module Intersection
 */

import { Vec2 } from './Vec2';
import { Vec3 } from './Vec3';
import { Line2 } from './Line2';

export class Intersection {
  static lineLine2(l1: Line2, l2: Line2, target: Vec2 = new Vec2()): Vec2 | null {
    const x1 = l1.start.x, y1 = l1.start.y;
    const x2 = l1.end.x, y2 = l1.end.y;
    const x3 = l2.start.x, y3 = l2.start.y;
    const x4 = l2.end.x, y4 = l2.end.y;

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null; // Parallel or collinear

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      target.x = x1 + ua * (x2 - x1);
      target.y = y1 + ua * (y2 - y1);
      return target;
    }

    return null;
  }

  static pointInPolygon2(point: Vec2, polygon: Vec2[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 1e-10) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  static raySphere(rayOrigin: Vec3, rayDir: Vec3, sphereCenter: Vec3, sphereRadius: number): number | null {
    const oc = rayOrigin.clone().sub(sphereCenter);
    const a = rayDir.dot(rayDir);
    const b = 2.0 * oc.dot(rayDir);
    const c = oc.dot(oc) - sphereRadius * sphereRadius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) return null;
    const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
    return t >= 0 ? t : null;
  }
}
