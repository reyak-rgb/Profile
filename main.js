(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme (saved choice, else system preference)
  const root = document.documentElement;
  let saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('#theme').onclick = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  };

  // Mobile menu
  const links = $('#links'), menu = $('#menu');
  menu.onclick = () => menu.setAttribute('aria-expanded', links.classList.toggle('open'));
  $$('a', links).forEach(a => a.onclick = () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); });

  // Reveal on scroll + active nav link
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
  const nav = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => nav.observe(s));

  // Count-up stats
  const run = el => {
    const to = +el.dataset.count; if (reduce) return el.textContent = to;
    const t0 = performance.now(), d = 1100;
    const f = t => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); p < 1 && requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  const so = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (run(e.target), so.unobserve(e.target))));
  $$('[data-count]').forEach(el => so.observe(el));

  // Workshop tabs
  $$('.tabs button').forEach(b => b.onclick = () => {
    $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    $$('[role=tabpanel]').forEach(p => p.hidden = p.id !== b.dataset.tab);
  });

  // Copy email
  $('#copy').onclick = async e => {
    try { await navigator.clipboard.writeText('reyak@rajagiritech.edu.in'); e.target.textContent = 'Copied ✓'; }
    catch (err) { e.target.textContent = 'Copy failed'; }
    setTimeout(() => e.target.textContent = 'Copy email', 2000);
  };
  $('#yr').textContent = new Date().getFullYear();

  // Hero background: a drifting graph (vertices and edges), a nod to graph theory
  const cv = $('#graph'), ctx = cv.getContext('2d'); let W, H, pts = [];
  const size = () => {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(48, W * H / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const cs = getComputedStyle(root), col = cs.getPropertyValue('--brand').trim();
    ctx.fillStyle = ctx.strokeStyle = col;
    pts.forEach((p, i) => {
      if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) { ctx.globalAlpha = (1 - d / 130) * .28; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill();
    });
    if (!reduce) requestAnimationFrame(draw);
  };
  size(); draw(); addEventListener('resize', () => { size(); reduce && draw(); });
  $('#theme').addEventListener('click', () => reduce && setTimeout(draw, 0));
})();
