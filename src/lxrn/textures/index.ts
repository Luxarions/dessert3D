/**
 * LXRN Textures
 * @module textures
 */

export class Texture {
  static idCounter = 0;
  id: number = ++Texture.idCounter;
  uuid: string = Math.random().toString(36).substring(2, 11);
  name: string = '';
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null = null;
  wrapS: string = 'clamp-to-edge';
  wrapT: string = 'clamp-to-edge';
  magFilter: string = 'linear';
  minFilter: string = 'linear';
  format: string = 'rgba';
  flipY: boolean = true;
  generateMipmaps: boolean = true;
  version: number = 0;

  constructor(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null = null) {
    this.image = image;
  }

  set needsUpdate(value: boolean) {
    if (value) this.version++;
  }
}

export class CanvasTexture extends Texture {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.needsUpdate = true;
  }
}

export class DataTexture extends Texture {
  data: Uint8Array | Float32Array;
  width: number;
  height: number;

  constructor(data: Uint8Array | Float32Array, width: number, height: number) {
    super(null);
    this.data = data;
    this.width = width;
    this.height = height;
    this.generateMipmaps = false;
    this.needsUpdate = true;
  }
}

export class CubeTexture extends Texture {
  images: HTMLImageElement[] = [];

  constructor(images: HTMLImageElement[] = []) {
    super(null);
    this.images = images;
  }
}
