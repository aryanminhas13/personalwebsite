(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let observer;
  function stop() { observer?.disconnect(); animations.forEach(a => a.cancel()); animations.clear(); }
  function play(el, delay = 0) {
    const animation = el.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    animations.add(animation); animation.onfinish = () => animations.delete(animation);
  }
  function start() {
    stop(); if(preference.matches || !('IntersectionObserver' in window)) return;
    document.querySelectorAll('.hero-kicker, .hero h1, .hero-bottom, .hero-foot').forEach((el,i) => {
      const r=el.getBoundingClientRect(); if(r.bottom>0 && r.top<innerHeight) play(el,i*110);
    });
    observer = new IntersectionObserver(entries => entries.filter(e=>e.isIntersecting).forEach((e,i)=>{play(e.target,Math.min(i,3)*95);observer.unobserve(e.target);}),{threshold:.08});
    document.querySelectorAll('.section-heading, .project, .more-work > article, .champion-copy, .about > div, .contact .wrap').forEach(el=>observer.observe(el));
  }
  start(); preference.addEventListener('change',start); addEventListener('pagehide',stop);
})();