/**
 * LXRN OrbitControls
 * Smooth Arcball Camera Controller for 3D navigation
 * @module controls/OrbitControls
 */

import { Camera } from '../core/Camera';
import { Vec3 } from '../math/Vec3';
import { Quat } from '../math/Quat';

export class OrbitControls {
  camera: Camera;
  domElement: HTMLElement;

  enabled: boolean = true;
  target: Vec3 = new Vec3(0, 0, 0);

  minDistance: number = 0.5;
  maxDistance: number = 500;
  minPolarAngle: number = 0.01;
  maxPolarAngle: number = Math.PI - 0.01;

  enableDamping: boolean = true;
  dampingFactor: number = 0.05;

  rotateSpeed: number = 1.0;
  zoomSpeed: number = 1.2;
  panSpeed: number = 1.0;

  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical = { radius: 10, phi: Math.PI / 4, theta: Math.PI / 4 };

  constructor(camera: Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.initListeners();
    this.update();
  }

  private initListeners(): void {
    const el = this.domElement;

    el.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.enabled || !this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.spherical.theta -= (deltaX * 0.005 * this.rotateSpeed);
      this.spherical.phi -= (deltaY * 0.005 * this.rotateSpeed);

      this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.update();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    el.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        this.spherical.radius *= this.zoomSpeed;
      } else {
        this.spherical.radius /= this.zoomSpeed;
      }

      this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
      this.update();
    }, { passive: false });
  }

  update(): void {
    const sinPhiRadius = Math.sin(this.spherical.phi) * this.spherical.radius;

    this.camera.position.x = this.target.x + sinPhiRadius * Math.sin(this.spherical.theta);
    this.camera.position.y = this.target.y + Math.cos(this.spherical.phi) * this.spherical.radius;
    this.camera.position.z = this.target.z + sinPhiRadius * Math.cos(this.spherical.theta);

    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld(true);
  }
}
