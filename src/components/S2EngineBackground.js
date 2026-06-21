import React, { useEffect, useState, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const S2EngineBackground = () => {
  const mountRef = useRef(null);
  const [containment, setContainment] = useState({
    stability: 99.86,
    decay: 0.9992,
    output: 100,
    temp: 24.5
  });

  // Ticking S2 Engine containment parameters
  useEffect(() => {
    const s2Interval = setInterval(() => {
      setContainment(prev => ({
        stability: parseFloat((99.78 + Math.random() * 0.18).toFixed(2)),
        decay: parseFloat((0.9985 + Math.random() * 0.0014).toFixed(4)),
        output: Math.floor(99 + Math.random() * 3),
        temp: parseFloat((24.2 + Math.random() * 0.7).toFixed(1))
      }));
    }, 550);

    return () => clearInterval(s2Interval);
  }, []);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040000);

    // Deep fog for volumetric atmosphere
    scene.fog = new THREE.FogExp2(0x040000, 0.0035);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Main Solenoid Core Group
    const coreGroup = new THREE.Group();

    // 1. Glowing Inner Solid Core Sphere
    const innerCoreGeo = new THREE.SphereGeometry(14, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // 2. Volumetric Outer Wireframe Shell
    const shellGeo = new THREE.SphereGeometry(18, 16, 16);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    coreGroup.add(shell);

    // 3. Multiaxis Orbiting Energy Rings
    const ringCount = 3;
    const orbitalRings = [];
    const ringGeometries = [];
    const ringMaterials = [];

    const ringColors = [0xff3c00, 0xff0033, 0xff7700];
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(32 + i * 8, 0.8, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.5 - i * 0.1,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      
      // Orient rings on different planes
      if (i === 0) ring.rotation.x = Math.PI / 3;
      if (i === 1) ring.rotation.y = Math.PI / 4;
      if (i === 2) {
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y = Math.PI / 6;
      }

      coreGroup.add(ring);
      orbitalRings.push(ring);
      ringGeometries.push(ringGeo);
      ringMaterials.push(ringMat);
    }

    scene.add(coreGroup);

    // Dynamic Inward-Flowing Gravity Particles (Gravity Well)
    const particleCount = 400;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    const initParticle = (i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() - 0.5) * 2);
      const r = 180 + Math.random() * 70; // Spawn far away
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r;

      particleSpeeds[i] = 0.6 + Math.random() * 1.4;
    };

    for (let i = 0; i < particleCount; i++) {
      initParticle(i);
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 1.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Core Point Light for volumetric glow
    const coreLight = new THREE.PointLight(0xff3300, 2.5, 300);
    scene.add(coreLight);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation based on cursor coordinates
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate Main Core Node
      coreGroup.rotation.y = time * 0.15;
      coreGroup.rotation.z = Math.sin(time * 0.1) * 0.15;

      // Animate inner solid core pulsing
      const innerScale = 1.0 + Math.sin(time * 5.0) * 0.12;
      innerCore.scale.set(innerScale, innerScale, innerScale);
      innerCoreMat.opacity = 0.7 + Math.sin(time * 5.0) * 0.15;

      // Rotate outer wireframe shell
      shell.rotation.x = -time * 0.25;
      shell.rotation.y = time * 0.3;

      // Rotate energy bands on separate axes
      orbitalRings.forEach((ring, i) => {
        ring.rotation.z += 0.008 * (i + 1);
        const ringScale = 1 + Math.sin(time * 2.5 + i) * 0.05;
        ring.scale.set(ringScale, ringScale, ringScale);
      });

      // Animate Gravity Well Particles (inward attraction flow)
      const posAttr = particlesGeo.getAttribute('position');
      const coords = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        let px = coords[i * 3];
        let py = coords[i * 3 + 1];
        let pz = coords[i * 3 + 2];

        const dist = Math.sqrt(px * px + py * py + pz * pz);
        const speed = particleSpeeds[i] * (1.0 + (150 / (dist + 10))); // Accelerate near center

        if (dist < 15) {
          // Re-initialize particle to outer boundaries on core absorption
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() - 0.5) * 2);
          const r = 180 + Math.random() * 50;
          coords[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
          coords[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
          coords[i * 3 + 2] = Math.cos(phi) * r;
        } else {
          // Attract towards the core node (0, 0, 0)
          coords[i * 3] -= (px / dist) * speed;
          coords[i * 3 + 1] -= (py / dist) * speed;
          coords[i * 3 + 2] -= (pz / dist) * speed;
        }
      }
      posAttr.needsUpdate = true;

      // Pulse core point lightintensity
      coreLight.intensity = 2.0 + Math.sin(time * 5.0) * 0.8;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (composer) {
        composer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose WebGL assets
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ringGeometries.forEach(g => g.dispose());
      ringMaterials.forEach(m => m.dispose());
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container s2-bg" ref={mountRef}>
      <div className="nerv-scanner-laser red-laser"></div>
      <div className="nerv-scanline"></div>
      
      {/* Solenoid containment diagnostic readout overlay */}
      <div className="s2-overlay">
        <div className="s2-header-panel">
          <div className="s2-title font-mono">S²_ENGINE // GRAV_WELL</div>
          <div className="s2-energy">OUTPUT: INFINITE_SINGULARITY // LEVEL_A ({containment.output}%)</div>
        </div>

        {/* Instability metrics panel */}
        <div className="s2-instability-overlay font-mono">
          <div className="s2-metric-box border-decor">
            <span>CORE COLLAPSE: NEGATIVE</span>
            <span>STABILITY INDEX: {containment.stability}%</span>
            <span>CORE TEMP: {containment.temp}°C</span>
            <div className="s2-warning blink-fast">EMERGENCY GRAVITY WELL ACTIVE</div>
          </div>
        </div>

        <div className="s2-footer-overlay font-mono text-danger">
          <div>CONTAINMENT_WELL // DECAY_INDEX: {containment.decay}</div>
          <div>WARNING: SINGULARITY LEVEL THREAT WITHIN SAFE MARGIN</div>
        </div>

        {/* Tactical Corner Brackets */}
        <div className="tactical-bracket top-left-bracket"></div>
        <div className="tactical-bracket top-right-bracket"></div>
        <div className="tactical-bracket bottom-left-bracket"></div>
        <div className="tactical-bracket bottom-right-bracket"></div>
      </div>
    </div>
  );
};

export default S2EngineBackground;
