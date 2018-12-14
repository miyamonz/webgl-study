export function create_vbo(gl, data) {
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}

export function create_ibo(gl, data) {
  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return ibo;
}
export function create_program(gl, vs, fs) {
  var program = gl.createProgram();

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  } else {
    alert(gl.getProgramInfoLog(program));
  }
}

function _create_shader(gl, text, isVert) {
  let shader = isVert
    ? gl.createShader(gl.VERTEX_SHADER)
    : gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(shader, text);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    alert(gl.getShaderInfoLog(shader));
  }
}
export function create_shader(gl, { vert, frag }) {
  return {
    vert: _create_shader(gl, vert, true),
    frag: _create_shader(gl, frag, false)
  };
}
export function createProgramFromShaderText(gl, { vert, frag }) {
  const { vert: vs, frag: fs } = create_shader(gl, { frag, vert });
  return create_program(gl, vs, fs);
}
