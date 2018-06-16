import Simulation from "./Simulation";
import createObj from "./createObj";
import createLight from "./createLight";

const colorPallete = [
  new THREE.Color(0x0d0232),
  new THREE.Color(0xe50061),
  new THREE.Color(0x1cafc0),
  new THREE.Color(0xefcb03)
];

export default class Webgl {
  constructor() {
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;
    this.init({ size: 128 });
    this.loop();
  }

  init({ size }) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(this.widthW, this.heightW);

    const sim = new Simulation(renderer, size);

    const container = document.getElementById("canvas");
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      this.widthW / this.heightW,
      0.01,
      10000
    );
    camera.position.set(-0.1, 4.0, 0.1);
    new THREE.OrbitControls(camera, renderer.domElement);
    const scene = new THREE.Scene();
    scene.add(camera);

    const light = createLight(scene.position);
    const { mesh, material, shadowMaterial } = createObj({
      size,
      light,
      colorPallete
    });
    scene.add(mesh);
    Object.assign(this, {
      renderer,
      sim,
      time: new THREE.Clock(),
      scene,
      mesh,
      camera,
      light,
      material,
      shadowMaterial
    });
  }

  updateUniformsOfMaterial(time, posMap, velMap) {
    const materials = [this.material, this.shadowMaterial];
    const uniformsArr = materials.map(ma => ma.uniforms);
    uniformsArr.map(uni => {
      uni.posMap.value = posMap;
      uni.velMap.value = velMap;
      uni.timer.value = time;
    });
  }

  render(...args) {
    const { renderer, scene } = this;
    renderer.render(scene, ...args);
  }
  updateRender() {
    //prettier-ignore
    const {
      renderer,
      light,
      material,
      shadowMaterial,
      camera,
      mesh
    } = this;
    mesh.material = shadowMaterial;
    const { shadow } = light;
    this.render(shadow.camera, shadow.map);

    renderer.setClearColor(0x2e0232);
    mesh.material = material;
    this.render(camera);
  }
  loop() {
    const { sim, time } = this;
    var delta = time.getDelta() * 4;
    var now = time.elapsedTime;

    sim.setTime(now, delta);
    sim.gpuCompute.compute();
    const posMap = sim.getPosMap();
    const velMap = sim.getVelMap();
    this.updateUniformsOfMaterial(now, posMap, velMap);
    this.updateRender();

    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;

    this.camera.aspect = this.widthW / this.heightW;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.widthW, this.heightW);
  }
}
