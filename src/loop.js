let start = Date.now();
let count = 0;
export default function loop(fn) {
  let time = Date.now() - start;
  fn({ time, count });
  count++;
  requestAnimationFrame(() => loop(fn));
}
