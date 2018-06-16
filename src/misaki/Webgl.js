import Simulation from "./Simulation";
import createObj from "./createObj";
import createLight from "./createLight";

export default class Webgl {
  constructor() {
    this.size = 128;
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;
    this.init();
  }

  init() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(this.widthW, this.heightW);

    const container = document.getElementById("canvas");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    this.colorPallete = [
      new THREE.Color(0x0d0232),
      new THREE.Color(0xe50061),
      new THREE.Color(0x1cafc0),
      new THREE.Color(0xefcb03)
    ];

    const camera = new THREE.PerspectiveCamera(
      45,
      this.widthW / this.heightW,
      0.01,
      10000
    );
    scene.add(camera);
    camera.position.set(-0.1, 4.0, 0.1);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    //mount on this
    this.sim = new Simulation(renderer, this.size);
    Object.assign(this, { renderer, scene, camera });

    this.light = createLight(scene.position);
    const { mesh, material, shadowMaterial } = createObj({
      size: this.size,
      light: this.light,
      colorPallete: this.colorPallete
    });
    scene.add(mesh);
    Object.assign(this, { scene, mesh, material, shadowMaterial });

    this.time = new THREE.Clock();
    this.render();
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
  render() {
    var delta = this.time.getDelta() * 4;
    var time = this.time.elapsedTime;

    this.sim.setTime(time, delta);
    this.sim.gpuCompute.compute();
    const posMap = this.sim.getPosMap();
    const velMap = this.sim.getVelMap();
    this.updateUniformsOfMaterial(time, posMap, velMap);

    //draw shadow, target
    this.mesh.material = this.shadowMaterial;
    const { shadow } = this.light;
    this.renderer.render(this.scene, shadow.camera, shadow.map);

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
