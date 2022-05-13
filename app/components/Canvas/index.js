import { Box, Camera, Plane, Renderer, Transform } from "ogl";

import Media from "./Media";

import Image1 from "../../../assets/1.jpg";

export default class {
  constructor({ url }) {
    this.url = url;

    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    this.gl = this.renderer.gl;
    this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 1);
    document.body.appendChild(this.gl.canvas);

    this.createCamera();
    this.createScene();
    this.createGeometry();
    // this.createGeometries();

    this.createMedias();

    this.onResize();
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometries() {
    this.boxGeometry = new Box(this.gl, {
      heightSegments: 20,
      widthSegments: 1,
    });

    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 1,
    });
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias() {
    this.mediasImages = [{ image: Image1 }];

    this.medias = this.mediasImages.map(({ image }, index) => {
      const media = new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
      });

      return media;
    });
  }

  onChange(url) {}

  onResize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    const values = {
      screen: this.screen,
      viewport: this.viewport,
    };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
        })
      );
    }
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp(event) {}

  update(application) {
    if (!application) return;

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, this.direction));
    }
  }
}
