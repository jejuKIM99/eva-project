import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const LCLBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x130400); // Very deep dark orange/black

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 110);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Deep fluid fog
    scene.fog = new THREE.FogExp2(0x130400, 0.007);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xff3300, 0.4);
    scene.add(ambientLight);

    // Moving dynamic light for glistening highlights
    const movingLight = new THREE.PointLight(0xff7700, 2.5, 250);
    movingLight.position.set(0, 0, 40);
    scene.add(movingLight);

    // Glowing Light Shafts (God Rays in LCL)
    const shaftGroup = new THREE.Group();
    const shaftCount = 6;
    const shafts = [];
    const shaftGeo = new THREE.CylinderGeometry(2, 8, 180, 16, 1, true);
    
    for (let i = 0; i < shaftCount; i++) {
      const shaftMat = new THREE.MeshBasicMaterial({
        color: 0xff3b00,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      
      // Random layout
      shaft.position.set(
        (Math.random() - 0.5) * 140,
        0,
        (Math.random() - 0.5) * 60
      );
      shaft.rotation.z = (Math.random() - 0.5) * 0.3;
      shaft.rotation.x = (Math.random() - 0.5) * 0.2;
      
      shaftGroup.add(shaft);
      shafts.push({
        mesh: shaft,
        seed: Math.random() * 100,
        speed: 0.3 + Math.random() * 0.4
      });
    }
    scene.add(shaftGroup);

    // Glistening organic bubble meshes
    const bubbleGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(2, 16, 16);
    const bubbleMat = new THREE.MeshPhongMaterial({
      color: 0xff6a00,
      emissive: 0x220500,
      specular: 0xffcc88,
      shininess: 120,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });

    const bubbles = [];
    const bubbleCount = 35;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 70
      );
      const scale = Math.random() * 1.6 + 0.4;
      bubble.scale.set(scale, scale, scale);
      
      bubbleGroup.add(bubble);
      bubbles.push({
        mesh: bubble,
        speed: 0.15 + Math.random() * 0.3,
        wobbleSpeed: 1 + Math.random() * 2,
        seed: Math.random() * 10,
        size: scale
      });
    }
    scene.add(bubbleGroup);

    // Drift particles (finer suspended particulate matter)
    const driftCount = 200;
    const driftGeo = new THREE.BufferGeometry();
    const driftPositions = new Float32Array(driftCount * 3);
    for (let i = 0; i < driftCount * 3; i += 3) {
      driftPositions[i] = (Math.random() - 0.5) * 200;
      driftPositions[i + 1] = (Math.random() - 0.5) * 200;
      driftPositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    driftGeo.setAttribute('position', new THREE.BufferAttribute(driftPositions, 3));
    const driftMat = new THREE.PointsMaterial({
      color: 0xff5500,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const driftPoints = new THREE.Points(driftGeo, driftMat);
    scene.add(driftPoints);

    // Wave grid (tactical grid indicating LCL wave dynamics)
    const waveGeo = new THREE.PlaneGeometry(160, 160, 24, 24);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const topWave = new THREE.Mesh(waveGeo, waveMat);
    topWave.rotation.x = Math.PI / 2;
    topWave.position.y = 65;
    scene.add(topWave);

    const bottomWave = topWave.clone();
    bottomWave.position.y = -65;
    scene.add(bottomWave);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.08;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.06;
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

      // Move light in Lissajous pattern
      movingLight.position.x = Math.sin(time * 0.8) * 50;
      movingLight.position.y = Math.cos(time * 0.6) * 40;
      movingLight.position.z = Math.sin(time * 1.1) * 30 + 10;

      // Animate Light Shafts (gentle sway)
      shafts.forEach(s => {
        s.mesh.rotation.z = Math.sin(time * 0.1 * s.speed + s.seed) * 0.2;
        s.mesh.rotation.x = Math.cos(time * 0.08 * s.speed + s.seed) * 0.1;
        s.mesh.position.x += Math.sin(time * 0.2 + s.seed) * 0.05;
      });

      // Rise and oscillate bubbles
      bubbles.forEach(b => {
        b.mesh.position.y += b.speed;
        b.mesh.position.x += Math.sin(time * b.wobbleSpeed + b.seed) * 0.08;
        b.mesh.position.z += Math.cos(time * b.wobbleSpeed + b.seed) * 0.04;
        
        // Dynamic scaling wobble
        const wobble = 1 + Math.sin(time * 5 + b.seed) * 0.05;
        b.mesh.scale.set(b.size * wobble, b.size * (2 - wobble), b.size);

        if (b.mesh.position.y > 75) {
          b.mesh.position.y = -75;
          b.mesh.position.x = (Math.random() - 0.5) * 160;
          b.mesh.position.z = (Math.random() - 0.5) * 70;
        }
      });

      // Slowly rotate and drift particles
      driftPoints.rotation.y = time * 0.01;
      driftPoints.rotation.x = Math.sin(time * 0.05) * 0.05;

      // Wave grid displacement
      const wavePositions = topWave.geometry.attributes.position.array;
      for (let i = 0; i < wavePositions.length; i += 3) {
        const x = wavePositions[i];
        const y = wavePositions[i + 1];
        wavePositions[i + 2] = Math.sin(x * 0.08 + time * 1.2) * 2.0 + Math.cos(y * 0.08 + time * 1.2) * 2.0;
      }
      topWave.geometry.attributes.position.needsUpdate = true;
      bottomWave.geometry.attributes.position.needsUpdate = true;

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
      
      // Resource cleanup
      shaftGeo.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      driftGeo.dispose();
      driftMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container lcl-bg" ref={mountRef}>
      <div className="lcl-vignette"></div>
      
      {/* Entry Plug LCL density monitoring dashboard overlay */}
      <div className="lcl-overlay font-mono">
        <div className="lcl-header-panel">
          <div className="lcl-title font-mono">LCL_FLUID_MONITOR</div>
          <div className="lcl-oxygen">OXYGEN_REPLACEMENT: 102% // SYS_ACTIVE</div>
        </div>

        {/* Dynamic Waveform Graph representing LCL fluid harmony */}
        <div className="lcl-gauge-panel">
          <svg className="lcl-gauge-svg" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,40 Q 25,65 50,40 T 100,40 T 150,40 T 200,40" fill="none" stroke="rgba(255, 106, 0, 0.4)" strokeWidth="1.5" className="lcl-wave-1" />
            <path d="M 0,40 Q 30,15 60,40 T 120,40 T 180,40 T 200,40" fill="none" stroke="rgba(255, 165, 0, 0.25)" strokeWidth="1" strokeDasharray="3, 3" className="lcl-wave-2" />
            <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255, 106, 0, 0.15)" strokeWidth="1" />
          </svg>
        </div>

        <div className="lcl-footer-panel">
          <div>LCL_DENSITY: 99.8% // EXPANSION_PRESSURE: 0.12MPa</div>
          <div>HARMONICS_ALIGNMENT: COMPATIBLE // TYPE: ALPHA</div>
        </div>

        {/* Framing brackets */}
        <div className="tactical-bracket top-left-bracket"></div>
        <div className="tactical-bracket top-right-bracket"></div>
        <div className="tactical-bracket bottom-left-bracket"></div>
        <div className="tactical-bracket bottom-right-bracket"></div>
      </div>
    </div>
  );
};

export default LCLBackground;
