import Simulation from "./Simulation";

import particlesVert from "../shader/particles.vert";
import particlesFrag from "../shader/particles.frag";
import particlesShadow from "../shader/particles-shadow.frag";

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
    // this.shadowCamera.position.set(-4, -6, 10);
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

    // index
    // var indices = originalG.index.clone();
    // geometry.setIndex(indices);

    geometry.maxInstancedCount = this.sim.size * this.sim.size;

    var nums = new THREE.InstancedBufferAttribute(
      new Float32Array(this.sim.size * this.sim.size * 1),
      1,
      1
    );
    var randoms = new THREE.InstancedBufferAttribute(
      new Float32Array(this.sim.size * this.sim.size * 1),
      1,
      1
    );
    var colors = new THREE.InstancedBufferAttribute(
      new Float32Array(this.sim.size * this.sim.size * 3),
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
      y: 8,
      z: 2
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        posMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos)
            .texture
        },
        velMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel)
            .texture
        },
        size: { type: "f", value: this.sim.size },

        timer: { type: "f", value: 0 },
        boxScale: {
          type: "v3",
          value: new THREE.Vector3(scale.x, scale.y, scale.z)
        },
        meshScale: { type: "f", value: 0.7 },

        shadowMap: { type: "t", value: this.light.shadow.map },
        shadowMapSize: { type: "v2", value: this.light.shadow.mapSize },
        shadowBias: { type: "f", value: this.light.shadow.bias },
        shadowRadius: { type: "f", value: this.light.shadow.radius },

        // Line 217 in https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLShadowMap.js
        shadowMatrix: { type: "m4", value: this.light.shadow.matrix },
        lightPosition: { type: "v3", value: this.light.position }
      },

      vertexShader: particlesVert,
      fragmentShader: particlesFrag,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.shadowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        posMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos)
            .texture
        },
        velMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel)
            .texture
        },
        size: { type: "f", value: this.sim.size },

        timer: { type: "f", value: 0 },
        boxScale: {
          type: "v3",
          value: new THREE.Vector3(scale.x, scale.y, scale.z)
        },
        meshScale: { type: "f", value: 0.7 },

        shadowMatrix: { type: "m4", value: this.light.shadow.matrix },
        lightPosition: { type: "v3", value: this.light.position }
      },
      vertexShader: particlesVert,
      fragmentShader: particlesShadow,
      side: THREE.DoubleSide
    });
  }

  render() {
    var delta = this.time.getDelta() * 4;
    var time = this.time.elapsedTime;

    this.sim.velUniforms.timer.value = time;
    this.sim.velUniforms.delta.value = delta;

    this.sim.gpuCompute.compute();

    this.material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(
      this.sim.pos
    ).texture;
    this.material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(
      this.sim.vel
    ).texture;

    this.shadowMaterial.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(
      this.sim.pos
    ).texture;
    this.shadowMaterial.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(
      this.sim.vel
    ).texture;

    this.material.uniforms.timer.value = this.shadowMaterial.uniforms.timer.value = time;

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
