import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Floating warm-orange + white bokeh particles with additive blending
 * and subtle mouse parallax. Transparent overlay.
 */
export default function CinematicLayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Bokeh sprite texture generated in a canvas
    const makeSpriteTexture = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.2, "rgba(255,220,180,0.8)");
      gradient.addColorStop(0.5, "rgba(255,150,60,0.25)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const sprite = makeSpriteTexture();

    const COUNT = 180;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT * 2);
    const colors = new Float32Array(COUNT * 3);

    const warm = new THREE.Color("#ff8a3d");
    const white = new THREE.Color("#fff2e0");
    const blue = new THREE.Color("#6ba8ff");

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      scales[i] = Math.random() * 3 + 0.6;
      seeds[i * 2 + 0] = Math.random() * Math.PI * 2;
      seeds[i * 2 + 1] = 0.2 + Math.random() * 0.5;

      const roll = Math.random();
      const c = roll < 0.7 ? warm : roll < 0.92 ? white : blue;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4.5,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0.9,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const start = performance.now();

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    const animate = () => {
      const t = (performance.now() - start) / 1000;

      // Smooth mouse parallax
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 4;
      camera.position.y = -mouse.y * 3;
      camera.lookAt(0, 0, 0);

      // Slow sine oscillation
      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i * 2];
        const sp = seeds[i * 2 + 1];
        const y = positions[i * 3 + 1] + Math.sin(t * sp + s) * 0.02;
        posAttr.array[i * 3 + 1] = y;
        posAttr.array[i * 3 + 0] = positions[i * 3] + Math.cos(t * sp * 0.6 + s) * 0.03;
      }
      posAttr.needsUpdate = true;

      points.rotation.z = Math.sin(t * 0.05) * 0.05;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}
