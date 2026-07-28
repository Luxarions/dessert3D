/**
 * LXRN Physics Engine & Particle Dynamics
 * @module physics
 */

import { Vec3 } from '../math/Vec3';
import { Quat } from '../math/Quat';
import { Bound3 } from '../math/Bound3';
import { Sphere } from '../math/Sphere';
import { Color } from '../math/Color';

export class RigidBody {
  id: number = Math.floor(Math.random() * 1000000);
  position: Vec3 = new Vec3();
  velocity: Vec3 = new Vec3();
  force: Vec3 = new Vec3();
  angularVelocity: Vec3 = new Vec3();
  quaternion: Quat = new Quat();

  mass: number = 1.0;
  invMass: number = 1.0;
  restitution: number = 0.5;
  friction: number = 0.3;
  linearDamping: number = 0.01;
  angularDamping: number = 0.01;
  isStatic: boolean = false;

  colliderType: 'sphere' | 'box' | 'plane' = 'sphere';
  boundingSphereRadius: number = 1.0;
  halfExtents: Vec3 = new Vec3(0.5, 0.5, 0.5);

  constructor(mass: number = 1.0) {
    this.setMass(mass);
  }

  setMass(mass: number): void {
    this.mass = mass;
    if (mass <= 0) {
      this.isStatic = true;
      this.invMass = 0;
    } else {
      this.isStatic = false;
      this.invMass = 1.0 / mass;
    }
  }

  applyForce(force: Vec3): void {
    if (this.isStatic) return;
    this.force.add(force);
  }

  applyImpulse(impulse: Vec3): void {
    if (this.isStatic) return;
    this.velocity.addScaledVector(impulse, this.invMass);
  }

  update(dt: number, gravity: Vec3): void {
    if (this.isStatic) return;

    // Apply gravity
    this.force.addScaledVector(gravity, this.mass);

    // Integrate velocity
    this.velocity.addScaledVector(this.force, this.invMass * dt);
    this.velocity.multiplyScalar(Math.pow(1 - this.linearDamping, dt));

    // Integrate position
    this.position.addScaledVector(this.velocity, dt);

    // Clear force
    this.force.set(0, 0, 0);
  }
}

export class PhysicsWorld {
  gravity: Vec3 = new Vec3(0, -9.81, 0);
  damping: number = 0.99;
  bodies: RigidBody[] = [];

  addBody(body: RigidBody): void {
    if (!this.bodies.includes(body)) {
      this.bodies.push(body);
    }
  }

  removeBody(body: RigidBody): void {
    const idx = this.bodies.indexOf(body);
    if (idx !== -1) this.bodies.splice(idx, 1);
  }

  update(dt: number): void {
    this.step(dt);
  }

  step(dt: number): void {
    // 1. Update velocities and positions
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update(dt, this.gravity);
    }

    // 2. Resolve Collisions
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        this.resolveCollision(this.bodies[i], this.bodies[j]);
      }
    }
  }

  private resolveCollision(a: RigidBody, b: RigidBody): void {
    if (a.isStatic && b.isStatic) return;

    // Sphere-Sphere Collision
    if (a.colliderType === 'sphere' && b.colliderType === 'sphere') {
      const delta = new Vec3().subVectors(b.position, a.position);
      const dist = delta.length();
      const minDist = a.boundingSphereRadius + b.boundingSphereRadius;

      if (dist < minDist && dist > 0.0001) {
        const normal = delta.clone().multiplyScalar(1 / dist);
        const penetration = minDist - dist;

        // Position adjustment
        const totalInvMass = a.invMass + b.invMass;
        if (totalInvMass > 0) {
          a.position.addScaledVector(normal, -penetration * (a.invMass / totalInvMass));
          b.position.addScaledVector(normal, penetration * (b.invMass / totalInvMass));
        }

        // Velocity resolution
        const relVel = new Vec3().subVectors(b.velocity, a.velocity);
        const velAlongNormal = relVel.dot(normal);

        if (velAlongNormal < 0) {
          const e = Math.min(a.restitution, b.restitution);
          const j = -(1 + e) * velAlongNormal / totalInvMass;
          const impulse = normal.clone().multiplyScalar(j);

          a.velocity.subScaledVector(impulse, a.invMass);
          b.velocity.addScaledVector(impulse, b.invMass);
        }
      }
    }
  }
}

export interface Particle {
  position: Vec3;
  velocity: Vec3;
  color: Color;
  size: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  particles: Particle[] = [];
  maxParticles: number;
  emitterPosition: Vec3 = new Vec3(0, 0, 0);
  rate: number = 50; // particles per sec

  constructor(maxParticles: number = 1000) {
    this.maxParticles = maxParticles;
  }

  emit(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      this.particles.push({
        position: this.emitterPosition.clone().add(new Vec3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)),
        velocity: new Vec3((Math.random() - 0.5) * 2, Math.random() * 3 + 2, (Math.random() - 0.5) * 2),
        color: new Color().setHSL(Math.random(), 0.8, 0.6),
        size: Math.random() * 0.2 + 0.1,
        life: 0,
        maxLife: Math.random() * 2 + 1
      });
    }
  }

  update(dt: number): void {
    this.emit(Math.floor(this.rate * dt));

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.position.addScaledVector(p.velocity, dt);
      p.velocity.y -= 4.9 * dt; // Gravity
    }
  }
}

export class PhysicsBody extends RigidBody {
  constructor(position?: Vec3, velocity?: Vec3, radius: number = 0.5, mass: number = 1, isStatic: boolean = false) {
    super(mass);
    if (position) this.position.copy(position);
    if (velocity) this.velocity.copy(velocity);
    this.boundingSphereRadius = radius;
    if (isStatic) this.setMass(0);
  }
}

export { PhysicsWorld as PhysicsEngine };

