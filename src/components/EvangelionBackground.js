import React, { useEffect, useState, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const EvangelionBackground = () => {
  const mountRef = useRef(null);
  const [ticks, setTicks] = useState({
    sync: 94.3,
    power: 100,
    temp: 36.5,
    integrity: 100,
    azimuth: 142.6,
    stabilizers: 'NOMINAL'
  });

  // Ticking parameter values to keep screen dynamic and alive
  useEffect(() => {
    const ticksInterval = setInterval(() => {
      setTicks(prev => ({
        sync: parseFloat((93.8 + Math.random() * 0.9).toFixed(1)),
        power: Math.floor(98 + Math.random() * 3),
        temp: parseFloat((36.2 + Math.random() * 0.7).toFixed(1)),
        integrity: Math.floor(99 + Math.random() * 2),
        azimuth: parseFloat((142.0 + Math.random() * 1.5).toFixed(1)),
        stabilizers: Math.random() > 0.05 ? 'NOMINAL' : 'CALIBRATING'
      }));
    }, 600);

    return () => clearInterval(ticksInterval);
  }, []);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000108); // Deep blue-black abyss

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 35, 140);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Deep grid fog
    scene.fog = new THREE.Fog(0x000108, 40, 240);

    // Grid Floor (tactical blueprint lines)
    const size = 1200;
    const divisions = 48;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x0055ff, 0x000a20);
    gridHelper.position.y = -35;
    scene.add(gridHelper);

    // Complex Cybernetic Torso Group
    const evaGroup = new THREE.Group();
    evaGroup.position.set(0, 10, 0);

    // 1. Glowing Core Sphere (S2 Engine coordinate)
    const coreGeo = new THREE.SphereGeometry(9, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    evaGroup.add(core);

    const coreWireGeo = new THREE.SphereGeometry(12, 12, 12);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    evaGroup.add(coreWire);

    // 2. Cybernetic Rib Cage (Nested circular torus rings)
    const ribs = [];
    const ribColors = [0x0055ff, 0x0077ff, 0x00aaff];
    for (let i = 0; i < 6; i++) {
      const ribGeo = new THREE.TorusGeometry(20 + i * 3, 0.6, 6, 48);
      const ribMat = new THREE.MeshBasicMaterial({
        color: ribColors[i % 3],
        transparent: true,
        opacity: 0.45 - i * 0.05,
        blending: THREE.AdditiveBlending
      });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.rotation.x = Math.PI / 2;
      rib.position.y = (i - 2.5) * 8;
      evaGroup.add(rib);
      ribs.push(rib);
    }

    // 3. Shoulder Pylons/Armor Bounds (Symmetrical wireframe prisms)
    const shoulderGroup = new THREE.Group();
    const pylonGeo = new THREE.BoxGeometry(10, 36, 18);
    const pylonMat = new THREE.MeshBasicMaterial({
      color: 0x0044ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const leftPylon = new THREE.Mesh(pylonGeo, pylonMat);
    leftPylon.position.set(-34, 15, -5);
    leftPylon.rotation.z = -0.15;
    shoulderGroup.add(leftPylon);

    const rightPylon = leftPylon.clone();
    rightPylon.position.x = 34;
    rightPylon.rotation.z = 0.15;
    shoulderGroup.add(rightPylon);
    evaGroup.add(shoulderGroup);

    // 4. Central Entry Plug Spine (holographic vertical capsule shaft)
    const spineGeo = new THREE.CylinderGeometry(5, 5, 80, 16, 4, true);
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0, -8);
    spine.rotation.x = 0.15; // Angled spine
    evaGroup.add(spine);

    // 5. Head Sensor Array Bounding Box
    const headGeo = new THREE.OctahedronGeometry(9, 0);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 32, -4);
    evaGroup.add(head);

    scene.add(evaGroup);

    // Orbiting blueprint coordinate data rings
    const orbitRingGroup = new THREE.Group();
    orbitRingGroup.position.set(0, 10, 0);
    const orbitRings = [];
    const ringRadii = [60, 75, 90];
    
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(ringRadii[i], ringRadii[i] + 1.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0055ff,
        transparent: true,
        opacity: 0.3 - i * 0.08,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      
      if (i === 0) ring.rotation.x = Math.PI / 2;
      if (i === 1) {
        ring.rotation.x = Math.PI / 3;
        ring.rotation.y = Math.PI / 4;
      }
      if (i === 2) {
        ring.rotation.x = Math.PI / 2.2;
        ring.rotation.y = -Math.PI / 6;
      }
      
      orbitRingGroup.add(ring);
      orbitRings.push(ring);
    }
    scene.add(orbitRingGroup);

    // Neural Synapse Pathway Flow (Drifting particle system representing neural harmony)
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    const riseSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Particles flowing along neural channels (cylindrical bounds)
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() > 0.4 ? (4 + Math.random() * 20) : (Math.random() * 4);
      const y = Math.random() * 120 - 60;
      
      posArr[i * 3] = Math.cos(theta) * r;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = Math.sin(theta) * r - 4;
      
      riseSpeeds[i] = 0.4 + Math.random() * 0.8;
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 1.6,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const neuralParticles = new THREE.Points(particlesGeo, particlesMat);
    evaGroup.add(neuralParticles);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.12;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
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
      camera.position.y += (-mouseY + 35 - camera.position.y) * 0.05;
      camera.lookAt(0, 10, 0);

      // Rotate central cybernetic model
      evaGroup.rotation.y = time * 0.12;
      evaGroup.rotation.x = Math.sin(time * 0.08) * 0.08;

      // Pulse S2 core sphere
      const corePulse = 1.0 + Math.sin(time * 4) * 0.12;
      core.scale.set(corePulse, corePulse, corePulse);
      coreWire.rotation.y = -time * 0.3;
      coreWire.rotation.x = time * 0.2;

      // Wobble rib rings
      ribs.forEach((rib, idx) => {
        const ringScale = 1.0 + Math.sin(time * 2.2 + idx) * 0.05;
        rib.scale.set(ringScale, ringScale, 1.0);
        rib.position.y = (idx - 2.5) * 8 + Math.sin(time * 1.5 + idx) * 1.2;
      });

      // Animate neural particle flow upwards
      const positions = particlesGeo.getAttribute('position');
      const pArr = positions.array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += riseSpeeds[i];
        
        // Wrap-around
        if (pArr[i * 3 + 1] > 60) {
          pArr[i * 3 + 1] = -60;
        }
      }
      positions.needsUpdate = true;

      // Rotate blueprint orbiting compass rings
      orbitRingGroup.rotation.y = -time * 0.04;
      orbitRings.forEach((ring, idx) => {
        ring.rotation.z = time * (0.08 + idx * 0.04);
      });

      gridHelper.rotation.y = time * 0.006;

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

      // Dispose assets
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      coreWireGeo.dispose();
      coreWireMat.dispose();
      pylonGeo.dispose();
      pylonMat.dispose();
      spineGeo.dispose();
      spineMat.dispose();
      headGeo.dispose();
      headMat.dispose();

      ribs.forEach(r => {
        r.geometry.dispose();
        r.material.dispose();
      });

      orbitRings.forEach(r => {
        r.geometry.dispose();
        r.material.dispose();
      });

      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container eva-bg" ref={mountRef}>
      <div className="nerv-scanner-laser blue-laser"></div>
      <div className="nerv-scanline"></div>

      {/* Blueprint Tactical Overlay */}
      <div className="eva-blueprint-overlay">
        <div className="blueprint-header-panel">
          <div className="blueprint-title font-mono">EVANGELION_UNIT_01 // VECTOR_SCAN</div>
          <div className="blueprint-sub-info">CLASSIFIED SCHEMATIC REALTIME MODEL ANALYSIS</div>
        </div>

        {/* Diagonal HUD scan gauges */}
        <div className="tactical-gauge-ring">
          <svg width="220" height="220" viewBox="0 0 100 100" className="rotating-gauge">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 102, 255, 0.15)" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0, 102, 255, 0.25)" strokeWidth="1" strokeDasharray="10, 15" />
            <path d="M 50,5 A 45,45 0 0,1 95,50" fill="none" stroke="#0066ff" strokeWidth="1.5" />
            <text x="50" y="52" fill="#0066ff" fontSize="6" fontFamily="Share Tech Mono" textAnchor="middle">EVA-01</text>
          </svg>
        </div>

        {/* Live parameter grid readouts */}
        <div className="blueprint-specs-overlay font-mono">
          <div className="spec-col col-left">
            <div>UNIT: <span className="spec-val">TEST_TYPE_01</span></div>
            <div>NERV_REG: <span className="spec-val">A-101</span></div>
            <div>A10_SYNC_RATE: <span className="spec-val">{ticks.sync}%</span></div>
            <div>STABILIZERS: <span className={ticks.stabilizers === 'NOMINAL' ? 'spec-val' : 'spec-val warn-orange'}>{ticks.stabilizers}</span></div>
          </div>
          <div className="spec-col col-right">
            <div>CORE_STRUCTURE: <span className="spec-val">SECURE</span></div>
            <div>POWER_OUTPUT: <span className="spec-val">{ticks.power}%</span></div>
            <div>CORE_TEMPERATURE: <span className="spec-val">{ticks.temp}°C</span></div>
            <div>ARMOR_INTEGRITY: <span className="spec-val">{ticks.integrity}%</span></div>
          </div>
        </div>

        {/* Reticle lock box */}
        <div className="blueprint-crosshair">
          <div className="ch-line-h"></div>
          <div className="ch-line-v"></div>
          <div className="ch-box"></div>
          <div className="ch-coords font-mono">X:{ticks.azimuth} // Y:30.4</div>
        </div>

        {/* Tactical Framing Brackets */}
        <div className="tactical-bracket top-left-bracket"></div>
        <div className="tactical-bracket top-right-bracket"></div>
        <div className="tactical-bracket bottom-left-bracket"></div>
        <div className="tactical-bracket bottom-right-bracket"></div>
      </div>
    </div>
  );
};

export default EvangelionBackground;
