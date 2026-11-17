// Shipwright Studio: word reveals, services tabs, team card.
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Headlines rise in word by word (skipped for reduced motion)
if (!still && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part;
            s.style.transitionDelay = `${Math.min(i++ * 45, 700)}ms`;
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('cursor')) wrap(n);
      });
    };
    wrap(el); el.classList.add('split'); io.observe(el);
  });
}

// 2. Services list
const SERVICES = [
  ['Fix, finish or build web apps in React, Next.js, Node.js and Supabase, from first version to launch.', ['React', 'Next.js', 'Node.js', 'Supabase']],
  ['Divi and Elementor pages, fixes and ongoing support that keep your design intact.', ['WordPress', 'Divi', 'Elementor', 'Support']],
  ['Assistants, document Q&A and workflows on the Claude and OpenAI APIs, wired into the app you already have.', ['Claude API', 'OpenAI', 'Integrations']],
  ['Booking forms with uploads and e-signatures, signed PDFs, Google Sheets and Drive, and email alerts.', ['Apps Script', 'Google Sheets', 'E-signature']],
  ['Store setup and fixes: product pages, bundles, apps and checkout issues.', ['Shopify', 'Bundles', 'Store polish']],
  ['Deploys that keep failing, custom domains, DNS, HTTPS, redirects and email delivery.', ['Render', 'Netlify', 'Vercel', 'DNS', 'DKIM']],
];
const tabs = [...document.querySelectorAll('.services__list button')];
const panel = document.querySelector('.services__panel');
const pick = (i) => {
  tabs.forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
  panel.querySelector('.services__num').textContent = `0${i + 1} / 0${SERVICES.length}`;
  panel.querySelector('.services__desc').textContent = SERVICES[i][0];
  panel.querySelector('.chips').innerHTML = SERVICES[i][1].map((c) => `<li>${c}</li>`).join('');
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => pick(i));
  t.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && pick(i));
  t.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (d) { e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; tabs[n].focus(); pick(n); }
  });
});

// 3. Team card: tap to show the next person
const stack = document.querySelector('.people__stack');
const people = [...stack.querySelectorAll('.person')];
let cur = 0;
const show = (i) => {
  people.forEach((p, j) => {
    p.classList.toggle('is-on', j === i);
    p.classList.toggle('is-next', j === (i + 1) % people.length);
  });
  document.querySelector('.people__name').textContent = people[i].dataset.name;
  document.querySelector('.people__role').textContent = people[i].dataset.role;
  document.querySelector('.people__hint').textContent = `( Tap the photo, ${i + 1} / ${people.length} )`;
};
stack.addEventListener('click', () => { cur = (cur + 1) % people.length; show(cur); });
show(0);
