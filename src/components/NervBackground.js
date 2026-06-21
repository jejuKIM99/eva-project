import React, { useEffect, useState, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const NERV_DIAGNOSTIC_LOGS = [
  "SYS_CORE: MAGI-1 (MELCHIOR) NOMINAL",
  "SYS_CORE: MAGI-2 (BALTHASAR) NOMINAL",
  "SYS_CORE: MAGI-3 (CASPER) COHERENT",
  "GEO_FRONT: LEVEL 12 SECTOR B BLOCKED",
  "DUMMY_PLUG: SYNAPSE CONNECTION READY",
  "LCL_PRESSURE: 0.12 MPa - NOMINAL",
  "A10_HARMONICS: COHERENT WITH EVA-01",
  "A.T. FIELD: STABLE MATRIX AT 98.4%",
  "NEURAL_SYNC: WAVE FUNCTION LOCKED",
  "CONTAINMENT_CHAMBER: SEALED SECURE",
  "REALITY_DECAY: 0.00% DETECTED",
  "MAGI_RESOLUTION: 3/3 STABILITY"
];

const NervBackground = () => {
  const mountRef = useRef(null);
  const [logs, setLogs] = useState(NERV_DIAGNOSTIC_LOGS.slice(0, 5));
  const [metrics, setMetrics] = useState({
    cpu: 89,
    temp: 34.6,
    stability: 99.98,
    azimuth: 182.4
  });

  // Ticking terminal data to make the UI look alive
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.floor(86 + Math.random() * 8),
        temp: parseFloat((34.2 + Math.random() * 0.9).toFixed(1)),
        stability: parseFloat((99.95 + Math.random() * 0.04).toFixed(2)),
        azimuth: parseFloat((182.0 + Math.random() * 0.9).toFixed(1))
      }));
    }, 800);

    const logsInterval = setInterval(() => {
      setLogs(prev => {
        const nextLog = NERV_DIAGNOSTIC_LOGS[Math.floor(Math.random() * NERV_DIAGNOSTIC_LOGS.length)];
        const timeStamp = new Date().toLocaleTimeString();
        const formattedLog = `[${timeStamp}] ${nextLog}`;
        return [...prev.slice(1), formattedLog];
      });
    }, 2000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(logsInterval);
    };
  }, []);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030100); // Pitch black with deep amber tint

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 60, 160);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Deep grid fog
    scene.fog = new THREE.Fog(0x030100, 40, 260);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xff3c00, 0.15);
    scene.add(ambientLight);

    // Floor Grid
    const size = 1600;
    const divisions = 64;
    const gridHelper = new THREE.GridHelper(size, divisions, 0xff3b00, 0x180500);
    gridHelper.position.y = -45;
    scene.add(gridHelper);

    // Main MAGI Chamber Group
    const magiSystemGroup = new THREE.Group();
    magiSystemGroup.position.set(0, 15, 0);

    // Consensus Matrix (Laser Triangles connecting the 3 MAGI cores)
    const consensusPoints = [
      new THREE.Vector3(Math.cos(0) * 45, 0, Math.sin(0) * 45),
      new THREE.Vector3(Math.cos((2 * Math.PI) / 3) * 45, 0, Math.sin((2 * Math.PI) / 3) * 45),
      new THREE.Vector3(Math.cos((4 * Math.PI) / 3) * 45, 0, Math.sin((4 * Math.PI) / 3) * 45)
    ];

    // Create line loop for consensus matrix
    const consensusGeo = new THREE.BufferGeometry().setFromPoints([...consensusPoints, consensusPoints[0]]);
    const consensusMat = new THREE.LineBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const consensusLine = new THREE.Line(consensusGeo, consensusMat);
    magiSystemGroup.add(consensusLine);

    // 3 Individual Holographic MAGI Cores (Melchior, Balthasar, Casper)
    const magiCores = [];
    const coreColors = [0xff2200, 0xff5500, 0xffbb00]; // Melchior (Red-Orange), Balthasar (Orange), Casper (Gold)
    const coreNames = ["MELCHIOR", "BALTHASAR", "CASPER"];

    for (let i = 0; i < 3; i++) {
      const coreGroup = new THREE.Group();
      const angle = (i * Math.PI * 2) / 3;
      coreGroup.position.set(Math.cos(angle) * 45, 0, Math.sin(angle) * 45);

      // Core Point Light
      const coreLight = new THREE.PointLight(coreColors[i], 1.8, 100);
      coreGroup.add(coreLight);

      // Inner wireframe sphere
      const sphereGeo = new THREE.SphereGeometry(7, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: coreColors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      coreGroup.add(sphere);

      // Outer rotating octahedron
      const octGeo = new THREE.OctahedronGeometry(11, 0);
      const octMat = new THREE.MeshBasicMaterial({
        color: coreColors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const oct = new THREE.Mesh(octGeo, octMat);
      coreGroup.add(oct);

      // Rotating diagnostic orbit rings
      const rings = [];
      for (let r = 0; r < 2; r++) {
        const ringGeo = new THREE.RingGeometry(13 + r * 3, 13.5 + r * 3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: coreColors[i],
          transparent: true,
          opacity: 0.25 - r * 0.1,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + (r * 0.3);
        ring.rotation.y = r * 0.4;
        coreGroup.add(ring);
        rings.push(ring);
      }

      magiSystemGroup.add(coreGroup);
      magiCores.push({
        group: coreGroup,
        sphere,
        oct,
        rings,
        light: coreLight,
        seed: Math.random() * 10
      });
    }

    // Interactive Floating Data Cubes (representing sub-systems and calculations)
    const cubeGroup = new THREE.Group();
    const cubeCount = 12;
    const cubes = [];
    const cubeGeo = new THREE.BoxGeometry(4, 4, 4);

    for (let i = 0; i < cubeCount; i++) {
      const cubeMat = new THREE.MeshBasicMaterial({
        color: 0xff3b00,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      
      // Random coordinates around MAGI system
      const theta = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 50;
      cube.position.set(
        Math.cos(theta) * r,
        (Math.random() - 0.5) * 40,
        Math.sin(theta) * r
      );
      
      cubeGroup.add(cube);
      cubes.push({
        mesh: cube,
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.02,
          Math.random() * 0.02,
          Math.random() * 0.02
        ),
        orbitSpeed: 0.05 + Math.random() * 0.1,
        radius: r,
        angle: theta,
        ySeed: Math.random() * 10
      });
    }
    magiSystemGroup.add(cubeGroup);

    // Giant outer server containment cage (representing MAGI mainframe walls)
    const cageGeo = new THREE.CylinderGeometry(75, 75, 90, 8, 3, true);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xff1100,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    magiSystemGroup.add(cage);

    scene.add(magiSystemGroup);

    // Drifting background data particles (binary streams)
    const particleCount = 250;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 400;
      positions[i + 1] = (Math.random() - 0.5) * 300 - 50;
      positions[i + 2] = (Math.random() - 0.5) * 400;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 1.6,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.12;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation based on cursor coordinates
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY + 60 - camera.position.y) * 0.05;
      camera.lookAt(0, 10, 0);

      // Rotate MAGI group slowly
      magiSystemGroup.rotation.y = time * 0.06;

      // Animate three MAGI cores
      magiCores.forEach((core, idx) => {
        // Core bobbing
        core.group.position.y = Math.sin(time * 1.5 + core.seed) * 3;
        
        // Pulse light intensity
        core.light.intensity = 1.5 + Math.sin(time * 4 + core.seed) * 0.6;

        // Core nested geometry spin
        core.sphere.rotation.y = -time * 0.4;
        core.sphere.rotation.x = Math.sin(time * 0.3) * 0.2;
        core.oct.rotation.y = time * 0.6;
        core.oct.rotation.z = time * 0.3;

        // Orbit ring counter-rotations
        core.rings.forEach((ring, rIdx) => {
          ring.rotation.z += 0.015 * (rIdx + 1);
        });
      });

      // Animate floating data cubes
      cubes.forEach(c => {
        // Local rotation
        c.mesh.rotation.x += c.rotSpeed.x;
        c.mesh.rotation.y += c.rotSpeed.y;
        c.mesh.rotation.z += c.rotSpeed.z;

        // Slow orbital sweep
        c.angle += 0.003 * c.orbitSpeed;
        c.mesh.position.x = Math.cos(c.angle) * c.radius;
        c.mesh.position.z = Math.sin(c.angle) * c.radius;
        c.mesh.position.y += Math.sin(time * 1.2 + c.ySeed) * 0.05;
      });

      // Rotate cages and particle clouds
      cage.rotation.y = -time * 0.02;
      gridHelper.rotation.y = time * 0.005;
      particles.rotation.y -= 0.0008;

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
      
      // Asset cleanup
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      consensusGeo.dispose();
      consensusMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      cubeGeo.dispose();
      
      magiCores.forEach(core => {
        core.sphere.geometry.dispose();
        core.sphere.material.dispose();
        core.oct.geometry.dispose();
        core.oct.material.dispose();
        core.rings.forEach(ring => {
          ring.geometry.dispose();
          ring.material.dispose();
        });
      });

      cubes.forEach(c => {
        c.mesh.material.dispose();
      });

      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container nerv-bg" ref={mountRef}>
      {/* NERV Cybernetic Laser Scanner Swipe Line */}
      <div className="nerv-scanner-laser"></div>
      <div className="nerv-scanline"></div>

      {/* MAGI Diagnostic HUD Overlay */}
      <div className="nerv-magi-overlay">
        <div className="magi-header-panel">
          <div className="magi-title font-mono">MAGI_SYSTEM // D.S.C.</div>
          <div className="magi-sub-status">CPU COHERENCE: TRIPLE REDUNDANCY ONLINE</div>
        </div>

        {/* Central Core coordinate compass ring */}
        <div className="magi-center-compass">
          <svg className="compass-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 106, 0, 0.2)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255, 106, 0, 0.15)" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,106,0,0.15)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,106,0,0.15)" strokeWidth="0.5" />
          </svg>
        </div>

        {/* MAGI nodes status grids */}
        <div className="magi-nodes-overlay">
          <div className="magi-hex-node melchior-hex border-decor">
            <span className="hex-title">MELCHIOR-1</span>
            <span className="hex-status resolved blink-slow">RESOLVED</span>
            <div className="hex-data font-mono">CODE: 01 // ADDR: 0x7E3A</div>
          </div>
          <div className="magi-hex-node balthasar-hex border-decor">
            <span className="hex-title">BALTHASAR-2</span>
            <span className="hex-status resolved blink-slow">RESOLVED</span>
            <div className="hex-data font-mono">CODE: 02 // ADDR: 0x8C1B</div>
          </div>
          <div className="magi-hex-node casper-hex border-decor">
            <span className="hex-title">CASPER-3</span>
            <span className="hex-status resolved blink-slow">RESOLVED</span>
            <div className="hex-data font-mono">CODE: 03 // ADDR: 0x9F4C</div>
          </div>
        </div>

        {/* Live Scrolling terminal log database */}
        <div className="magi-terminal-logger font-mono border-decor">
          <div className="terminal-header">SYSTEM_SCANNER // RUNNING</div>
          <div className="terminal-log-container">
            {logs.map((log, idx) => (
              <div key={idx} className="log-line">{log}</div>
            ))}
          </div>
        </div>

        {/* Live updating diagnostic metrics */}
        <div className="magi-live-metrics font-mono">
          <div>CPU_LOAD: <span className="metric-val">{metrics.cpu}%</span></div>
          <div>CORE_TEMP: <span className="metric-val">{metrics.temp}°C</span></div>
          <div>STABILITY: <span className="metric-val">{metrics.stability}%</span></div>
          <div>AZIMUTH: <span className="metric-val">{metrics.azimuth}°</span></div>
        </div>

        <div className="nerv-bottom-data font-mono">
          <div>GEOGRAPHY_SCAN: GEO_FRONT_LEVEL_12 // GEODETIC AXIS: SECURE</div>
          <div>MAGI SYS_INTEGRITY: 99.98% // SYSTEM_STABILITY_INDEX: ALPHA</div>
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

export default NervBackground;
