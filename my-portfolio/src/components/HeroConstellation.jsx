import React, { useEffect, useRef } from 'react';

// A drifting node graph behind the hero. Links form between nearby nodes and brighten
// around the pointer or a dragging finger. Pauses off-screen; draws one still frame for
// reduced motion.
export default function HeroConstellation({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let nodes = [];
    let frame = 0;
    let running = false;

    const seed = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (width * height) / 14000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.8 + Math.random() * 1.6,
      }));
    };

    const linkDistance = () => Math.min(150, Math.max(90, width / 9));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const maxDistance = linkDistance();
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > maxDistance) continue;
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const nearPointer = pointer.active ? Math.max(0, 1 - Math.hypot(midX - pointer.x, midY - pointer.y) / 180) : 0;
          const alpha = (1 - distance / maxDistance) * (0.12 + nearPointer * 0.55);
          context.strokeStyle = nearPointer > 0.05 ? `rgba(255, 46, 138, ${alpha})` : `rgba(110, 150, 255, ${alpha})`;
          context.lineWidth = 0.6 + nearPointer;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
      for (const node of nodes) {
        const glow = pointer.active ? Math.max(0, 1 - Math.hypot(node.x - pointer.x, node.y - pointer.y) / 160) : 0;
        context.fillStyle = glow > 0.05 ? `rgba(255, 182, 218, ${0.5 + glow * 0.5})` : 'rgba(185, 208, 255, 0.5)';
        context.beginPath();
        context.arc(node.x, node.y, node.r + glow * 1.6, 0, Math.PI * 2);
        context.fill();
      }
    };

    const step = () => {
      for (const node of nodes) {
        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 200 && distance > 1) {
            node.vx += (dx / distance) * 0.012;
            node.vy += (dy / distance) * 0.012;
          }
        }
        node.vx *= 0.985;
        node.vy *= 0.985;
        const speed = Math.hypot(node.vx, node.vy);
        if (speed < 0.08) { node.vx += (Math.random() - 0.5) * 0.04; node.vy += (Math.random() - 0.5) * 0.04; }
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const toLocal = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const release = () => { pointer.active = false; };

    seed();
    draw();
    start();

    const host = canvas.closest('section') || canvas.parentElement;
    host.addEventListener('pointermove', toLocal);
    host.addEventListener('pointerdown', toLocal);
    host.addEventListener('pointerleave', release);
    host.addEventListener('pointerup', (event) => { if (event.pointerType !== 'mouse') release(); });
    const resizeObserver = new ResizeObserver(() => { seed(); draw(); });
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);
    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      host.removeEventListener('pointermove', toLocal);
      host.removeEventListener('pointerdown', toLocal);
      host.removeEventListener('pointerleave', release);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
