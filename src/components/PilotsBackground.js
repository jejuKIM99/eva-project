import React, { useEffect, useState, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const PilotsBackground = () => {
  const mountRef = useRef(null);
  const [baseSync, setBaseSync] = useState(41.3);
  const [isSyncNa, setIsSyncNa] = useState(false);
  const [vitals, setVitals] = useState({
    sync: '41.3%',
    lclPress: 0.12,
    lclO2: 99.8,
    harmonics: 1.002
  });

  const syncRef = useRef(41.3);
  const isSyncNaRef = useRef(false);

  // Subscribe to dynamic active pilot sync changes
  useEffect(() => {
    const handleSyncChange = (e) => {
      const syncStr = e.detail;
      if (syncStr === 'N/A') {
        setIsSyncNa(true);
        isSyncNaRef.current = true;
        setBaseSync(0);
        syncRef.current = 0;
      } else {
        setIsSyncNa(false);
        isSyncNaRef.current = false;
        const parsed = parseFloat(syncStr) || 41.3;
        setBaseSync(parsed);
        syncRef.current = parsed;
      }
    };
    window.addEventListener('activePilotSyncChange', handleSyncChange);
    return () => window.removeEventListener('activePilotSyncChange', handleSyncChange);
  }, []);

  // Fluctuating vitals to keep the interface highly dynamic
  useEffect(() => {
    const vitalsInterval = setInterval(() => {
      setVitals(prev => {
        let syncVal;
        if (isSyncNa) {
          syncVal = 'N/A';
        } else {
          const variance = (Math.random() - 0.5) * 1.6;
          syncVal = `${(baseSync + variance).toFixed(1)}%`;
        }

        return {
          sync: syncVal,
          lclPress: parseFloat((0.11 + Math.random() * 0.02).toFixed(2)),
          lclO2: parseFloat((99.6 + Math.random() * 0.4).toFixed(1)),
          harmonics: parseFloat((0.998 + Math.random() * 0.008).toFixed(3))
        };
      });
    }, 700);

    return () => clearInterval(vitalsInterval);
  }, [baseSync, isSyncNa]);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060000); // Dark bio-void

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 115);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Volumetric bio-fog
    scene.fog = new THREE.Fog(0x060000, 30, 200);

    // Entry Plug cockpit group
    const plugGroup = new THREE.Group();

    // 1. Core capsule cylinder (glowing wireframe)
    const geomCylinder = new THREE.CylinderGeometry(15, 15, 140, 16, 12, true);
    const matCylinder = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const cylinder = new THREE.Mesh(geomCylinder, matCylinder);
    plugGroup.add(cylinder);

    // 2. Synaptic/Neural connection fiber pathways branching out
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff1100,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const synapseBranchGroup = new THREE.Group();
    const branchCount = 8;

    for (let i = 0; i < branchCount; i++) {
      const points = [];
      const startAngle = (i * Math.PI * 2) / branchCount;
      let startX = Math.cos(startAngle) * 15;
      let startZ = Math.sin(startAngle) * 15;
      let startY = (Math.random() - 0.5) * 100;

      points.push(new THREE.Vector3(startX, startY, startZ));

      // Walk outward like a lightning/neural fiber
      let currX = startX;
      let currY = startY;
      let currZ = startZ;
      for (let j = 0; j < 5; j++) {
        currX += Math.cos(startAngle) * (10 + Math.random() * 8) + (Math.random() - 0.5) * 8;
        currY += (Math.random() - 0.5) * 20;
        currZ += Math.sin(startAngle) * (10 + Math.random() * 8) + (Math.random() - 0.5) * 8;
        points.push(new THREE.Vector3(currX, currY, currZ));
      }

      const branchGeo = new THREE.BufferGeometry().setFromPoints(points);
      const branchLine = new THREE.Line(branchGeo, lineMat);
      synapseBranchGroup.add(branchLine);
    }
    plugGroup.add(synapseBranchGroup);

    // 3. Orbiting HUD Cockpit sync rings
    const rings = [];
    const ringColors = [0xff3300, 0xff5500, 0xff7700];
    for (let i = 0; i < 5; i++) {
      const ringGeom = new THREE.RingGeometry(22 + i * 5, 23 + i * 5, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i % 3],
        transparent: true,
        opacity: 0.3 - i * 0.05,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = (i - 2) * 24;
      ring.rotation.x = Math.PI / 2;
      plugGroup.add(ring);
      rings.push(ring);
    }

    // 4. Synapse bio-particles (neural data flowing between pilot & plug)
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleYLimits = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 14 + 1; // inside plug cylinder
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      particleSpeeds[i] = 0.5 + Math.random() * 1.5;
      particleYLimits[i] = 70; // cylinder length bounds
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xff3b00,
      size: 1.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    plugGroup.add(particleSystem);

    scene.add(plugGroup);

    // Point lighting in plug
    const plugLight = new THREE.PointLight(0xff3300, 2.0, 150);
    scene.add(plugLight);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.12;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation based on cursor coordinates
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate whole cockpit plug slowly
      plugGroup.rotation.y = time * 0.15;
      cylinder.rotation.x = Math.sin(time * 0.2) * 0.08;

      // Pulse plug lighting
      plugLight.intensity = 1.5 + Math.sin(time * 3) * 0.5;

      // Counter-rotate HUD rings
      rings.forEach((ring, index) => {
        ring.rotation.z = time * (0.1 + index * 0.05);
        const ringScale = 1.0 + Math.sin(time * 2.5 + index) * 0.05;
        ring.scale.set(ringScale, ringScale, ringScale);
      });

      // Animate synapse bio-particles flow
      // Speed scales dynamically with the pilot's sync rate!
      const syncMultiplier = isSyncNaRef.current ? 0.15 : (syncRef.current / 40);
      const posAttr = particlesGeo.getAttribute('position');
      const coords = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        let y = coords[i * 3 + 1];
        
        // Particles move upwards or downwards along spine
        y += particleSpeeds[i] * syncMultiplier;
        
        if (y > particleYLimits[i]) {
          y = -particleYLimits[i];
        }
        coords[i * 3 + 1] = y;

        // Subtle wiggle
        coords[i * 3] += Math.sin(time * 2 + i) * 0.02;
        coords[i * 3 + 2] += Math.cos(time * 2 + i) * 0.02;
      }
      posAttr.needsUpdate = true;

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
      geomCylinder.dispose();
      matCylinder.dispose();
      lineMat.dispose();
      
      synapseBranchGroup.children.forEach(b => {
        b.geometry.dispose();
      });

      rings.forEach(r => {
        r.geometry.dispose();
        r.material.dispose();
      });

      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container pilots-bg" ref={mountRef}>
      <div className="nerv-scanner-laser red-laser"></div>
      <div className="pilots-vignette"></div>
      
      {/* HUD Tactical Overlays for Pilots (Entry Plug Synchronization Interface) */}
      <div className="pilots-data-overlay">
        
        {/* Sync Rate monitor */}
        <div className="sync-rate-container border-decor">
          <div className="corner-tag top-left">A10-SYS</div>
          <div className="corner-tag top-right">V.09</div>
          <div className="sync-label">NERVE_HARMONICS // A10</div>
          <div className="sync-data-row">
            <span className="sync-pct">SYNC: {vitals.sync}</span>
            <span className="sync-status blink-fast">NORMAL</span>
          </div>
          <div className="sync-bar-wrapper">
            <div className="sync-bar-active" style={{ width: `${parseFloat(vitals.sync) || 0}%` }}></div>
          </div>
        </div>

        {/* Dynamic A10 Wave Grid (SVG line animations) */}
        <svg className="a10-nerve-grid-svg" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="glow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff0000" stopOpacity="0.1"/>
              <stop offset="50%" stopColor="#ff3c00" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,0,0,0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,0,0,0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="200" y1="0" x2="200" y2="200" stroke="rgba(255,0,0,0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="300" y1="0" x2="300" y2="200" stroke="rgba(255,0,0,0.15)" strokeWidth="1" strokeDasharray="5,5" />
          
          <path d="M 0,100 Q 50,20 100,100 T 200,100 T 300,100 T 400,100" fill="none" stroke="url(#glow-grad)" strokeWidth="2.5" className="wave-anim-1" />
          <path d="M 0,100 Q 30,170 80,100 T 180,100 T 280,100 T 400,100" fill="none" stroke="rgba(255,69,0,0.5)" strokeWidth="1.2" strokeDasharray="3,3" className="wave-anim-2" />
        </svg>

        <div className="neural-connection font-mono">
          <div>ENTRY_PLUG_SYNC: ESTABLISHED</div>
          <div>LCL_PRESSURE: {vitals.lclPress} MPa</div>
          <div>LCL_OXYGEN_RATION: {vitals.lclO2}%</div>
          <div>HARMONICS_INDEX: {vitals.harmonics}</div>
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

export default PilotsBackground;
