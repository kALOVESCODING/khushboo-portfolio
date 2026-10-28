document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Three.js particle background
(function () {
  const canvas = document.getElementById('bg');
  if (!window.THREE) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
  camera.position.z = 5;

  const N = 1600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const palette = [0x7C5CFF, 0x22D3EE, 0xF472B6].map(c => new THREE.Color(c));
  for (let i = 0; i < N; i++) {
    pos.set([(Math.random() - .5) * 20, (Math.random() - .5) * 20, (Math.random() - .5) * 20], i * 3);
    const c = palette[i % 3]; col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9 }));
  scene.add(pts);

  let mx = 0, my = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  function resize() { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  (function loop() {
    pts.rotation.y += 0.0008; pts.rotation.x += 0.0003;
    camera.position.x += (mx * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-my * 1.5 - camera.position.y) * 0.03;
    camera.position.z = 5 + Math.min(scrollY / 400, 3);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
})();
