import Simulation from "./Simulation";

import { createMaterial, createShadowMaterial } from "./createMaterial";

export default class Webgl {
  constructor() {
    this.size = 128;
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;
    this.init();
  }

  init() {
    this.container = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.widthW, this.heightW);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.colorPallete = [
      new THREE.Color(0x0d0232),
      new THREE.Color(0xe50061),
      new THREE.Color(0x1cafc0),
      new THREE.Color(0xefcb03)
    ];

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.widthW / this.heightW,
      0.01,
      10000
    );
    this.scene.add(this.camera);
    this.camera.position.set(-0.1, 4.0, 0.1);

    var controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.sim = new Simulation(this.renderer, this.size);

    this.setLight();
    this.createObj();

    this.time = new THREE.Clock();
    this.render();
  }

  setLight() {
    this.light = new THREE.DirectionalLight(0xffaa55);
    this.light.position.set(-4, -6, 10);
    this.light.castShadow = true;
    this.shadowCamera = this.light.shadow.camera;
    this.shadowCamera.lookAt(this.scene.position);

    //prettier-ignore
    this.light.shadow.matrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );

    this.light.shadow.matrix.multiply(this.shadowCamera.projectionMatrix);
    this.light.shadow.matrix.multiply(this.shadowCamera.matrixWorldInverse);

    if (this.light.shadow.map === null) {
      this.light.shadow.mapSize.x = 2048;
      this.light.shadow.mapSize.y = 2048;

      var pars = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
      };

      this.light.shadow.map = new THREE.WebGLRenderTarget(
        this.light.shadow.mapSize.x,
        this.light.shadow.mapSize.y,
        pars
      );
      // light.shadow.map.texture.name = light.name + ".shadowMap";
    }

    console.log(this.light);
  }

  createObj() {
    // var originalG = new THREE.BoxBufferGeometry(1, 1, 1);
    var originalG = new THREE.OctahedronBufferGeometry(1, 0);

    var geometry = new THREE.InstancedBufferGeometry();

    // vertex
    var vertices = originalG.attributes.position.clone();

    geometry.addAttribute("position", vertices);

    var normals = originalG.attributes.normal.clone();
    geometry.addAttribute("normal", normals);

    // uv
    var uvs = originalG.attributes.uv.clone();
    geometry.addAttribute("uv", uvs);

    const size = this.sim.size;
    geometry.maxInstancedCount = size ** 2;

    var nums = new THREE.InstancedBufferAttribute(
      new Float32Array(size ** 2),
      1,
      1
    );
    var randoms = new THREE.InstancedBufferAttribute(
      new Float32Array(size ** 2),
      1,
      1
    );
    var colors = new THREE.InstancedBufferAttribute(
      new Float32Array(3 * size ** 2),
      3,
      1
    );

    for (var i = 0; i < nums.count; i++) {
      var _color = this.colorPallete[
        Math.floor(Math.random() * this.colorPallete.length)
      ];

      nums.setX(i, i);
      randoms.setX(i, Math.random() * 0.5 + 1);
      colors.setXYZ(i, _color.r, _color.g, _color.b);
    }

    geometry.addAttribute("aNum", nums);
    geometry.addAttribute("aRandom", randoms);
    geometry.addAttribute("aColor", colors);

    var scale = {
      x: 2,
      y: 3,
      z: 2
    };

    const param = {
      size: this.sim.size,
      scale,
      light: this.light
    };
    this.material = createMaterial(param);
    this.shadowMaterial = createShadowMaterial(param);

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    var delta = this.time.getDelta() * 4;
    var time = this.time.elapsedTime;

    this.sim.setTime(time, delta);
    this.sim.gpuCompute.compute();

    const posMap = this.sim.getPosMap();
    const velMap = this.sim.getVelMap();
    this.material.uniforms.posMap.value = posMap;
    this.material.uniforms.velMap.value = velMap;
    this.shadowMaterial.uniforms.posMap.value = posMap;
    this.shadowMaterial.uniforms.velMap.value = velMap;

    this.material.uniforms.timer.value = this.shadowMaterial.uniforms.timer.value = time;

    //draw shadow, target
    this.mesh.material = this.shadowMaterial;
    this.renderer.render(this.scene, this.shadowCamera, this.light.shadow.map);

    this.renderer.setClearColor(0x2e0232);
    this.mesh.material = this.material;
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;

    this.camera.aspect = this.widthW / this.heightW;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.widthW, this.heightW);
  }
}
