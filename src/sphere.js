import hsva from "./hsva";
export default (row, column, rad, color) => {
  let pos = new Array(),
    nor = new Array(),
    col = new Array(),
    idx = new Array();
  for (let i = 0; i <= row; i++) {
    let r = (Math.PI / row) * i;
    let ry = Math.cos(r);
    let rr = Math.sin(r);
    for (let ii = 0; ii <= column; ii++) {
      let tr = ((Math.PI * 2) / column) * ii;
      let tx = rr * rad * Math.cos(tr);
      let ty = ry * rad;
      let tz = rr * rad * Math.sin(tr);
      let rx = rr * Math.cos(tr);
      let rz = rr * Math.sin(tr);
      let tc;
      if (color) {
        tc = color;
      } else {
        tc = hsva((360 / row) * i, 1, 1, 0.7);
      }
      pos.push(tx, ty, tz);
      nor.push(rx, ry, rz);
      col.push(tc[0], tc[1], tc[2], tc[3]);
    }
  }
  for (let i = 0; i < row; i++) {
    for (let ii = 0; ii < column; ii++) {
      let r = (column + 1) * i + ii;
      idx.push(r, r + 1, r + column + 2);
      idx.push(r, r + column + 2, r + column + 1);
    }
  }
  return [pos, nor, col, idx];
};
