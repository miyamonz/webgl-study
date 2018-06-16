const createIAttr = (size, num = 1) =>
  new THREE.InstancedBufferAttribute(new Float32Array(num * size ** 2), num, 1);

export default ({ size, colorPallete }) => {
  // var originalG = new THREE.BoxBufferGeometry(1, 1, 1);
  var originalG = new THREE.OctahedronBufferGeometry(1, 0);

  var geometry = new THREE.InstancedBufferGeometry();

  var vertices = originalG.attributes.position.clone();
  geometry.addAttribute("position", vertices);

  var normals = originalG.attributes.normal.clone();
  geometry.addAttribute("normal", normals);

  // uv
  var uvs = originalG.attributes.uv.clone();
  geometry.addAttribute("uv", uvs);

  geometry.maxInstancedCount = size ** 2;

  let nums = createIAttr(size);
  let randoms = createIAttr(size);
  let colors = createIAttr(size, 3);

  for (var i = 0; i < nums.count; i++) {
    var _color = colorPallete[Math.floor(Math.random() * colorPallete.length)];

    nums.setX(i, i);
    randoms.setX(i, Math.random() * 0.5 + 1);
    colors.setXYZ(i, _color.r, _color.g, _color.b);
  }

  geometry.addAttribute("aNum", nums);
  geometry.addAttribute("aRandom", randoms);
  geometry.addAttribute("aColor", colors);
  return geometry;
};
