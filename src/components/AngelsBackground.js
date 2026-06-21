import React, { useEffect, useState, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const AngelsBackground = () => {
  const mountRef = useRef(null);
  const [threat, setThreat] = useState({
    azimuth: 182.4,
    elevation: 12.8,
    range: 12000,
    velocity: 2.5,
    atField: '98.6%'
  });

  // Dynamic ticking threat tracking data
  useEffect(() => {
    const threatInterval = setInterval(() => {
      setThreat(prev => ({
        azimuth: parseFloat((182.0 + Math.random() * 0.9).toFixed(1)),
        elevation: parseFloat((12.5 + Math.random() * 0.6).toFixed(1)),
        range: Math.floor(11850 + Math.random() * 300),
        velocity: parseFloat((2.4 + Math.random() * 0.2).toFixed(2)),
        atField: Math.random() > 0.05 ? 'ACTIVE (98.6%)' : 'FLUCTUATING'
      }));
    }, 450);

    return () => clearInterval(threatInterval);
  }, []);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060000); // Deep red-black abyss

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 120, 210);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Fog
    scene.fog = new THREE.Fog(0x060000, 50, 320);

    const radarGroup = new THREE.Group();
    radarGroup.position.y = -25;

    // 1. 3D Spherical Defensive Grid Dome (Tokyo-3 airspace)
    const domeGeo = new THREE.SphereGeometry(150, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0xff1100,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    radarGroup.add(dome);

    // 2. Concentric coordinate rings on floor
    const rings = [];
    const ringColors = [0xff0000, 0xd92626, 0xaa1111, 0x770000, 0x440000];
    
    for (let i = 0; i < 5; i++) {
      const ringGeom = new THREE.RingGeometry(i * 35 + 10, i * 35 + 11.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.5 - i * 0.08,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      radarGroup.add(ring);
      rings.push(ring);
    }

    // Coordinate grid axes
    const axesGroup = new THREE.Group();
    const axisMat = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.15 });
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const points = [];
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(Math.cos(angle) * 160, 0, Math.sin(angle) * 160));
      
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const axis = new THREE.Line(geom, axisMat);
      axesGroup.add(axis);
    }
    radarGroup.add(axesGroup);

    // 3. Radar Scanning Wedge (Sweep)
    const sweepGeo = new THREE.CircleGeometry(160, 32, 0, Math.PI / 4);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });
    const sweep = new THREE.Mesh(sweepGeo, sweepMat);
    sweep.rotation.x = Math.PI / 2;
    radarGroup.add(sweep);

    // 4. Combat particles (radar noise/air traffic)
    const particleCount = 180;
    const particlesGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const heights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 130;
      const h = Math.random() * 80;
      
      angles[i] = angle;
      radii[i] = r;
      heights[i] = h;

      posArr[i * 3] = Math.cos(angle) * r;
      posArr[i * 3 + 1] = h;
      posArr[i * 3 + 2] = Math.sin(angle) * r;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    
    const particlesMat = new THREE.PointsMaterial({
      color: 0xff3300,
      size: 2.0,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    radarGroup.add(particleSystem);

    // 5. Dynamic Threat Targets (Angel coordinates and A.T. Fields)
    const targets = [];
    const targetColors = [0xff0000, 0xff3c00, 0xff0055];

    for (let i = 0; i < 3; i++) {
      const targetGroup = new THREE.Group();

      // Threat wireframe capsule/octahedron
      const innerGeo = new THREE.OctahedronGeometry(6, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: targetColors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      targetGroup.add(inner);

      // Orbiting Hexagonal A.T. Field shield rings
      const hexGeo = new THREE.RingGeometry(9, 10, 6);
      const hexMat = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const hex = new THREE.Mesh(hexGeo, hexMat);
      hex.rotation.x = Math.PI / 2;
      targetGroup.add(hex);

      // Ground altitude coordinate trace line
      const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -100, 0)];
      const projGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
      const projMat = new THREE.LineDashedMaterial({
        color: 0xff0000,
        dashSize: 4,
        gapSize: 3,
        transparent: true,
        opacity: 0.4
      });
      const projLine = new THREE.Line(projGeom, projMat);
      projLine.computeLineDistances();
      targetGroup.add(projLine);

      // Positioning
      const angle = (i * Math.PI * 2) / 3 + Math.random() * 0.5;
      const radius = 55 + Math.random() * 60;
      const targetHeight = 40 + Math.random() * 35;
      
      targetGroup.position.set(
        Math.cos(angle) * radius,
        targetHeight,
        Math.sin(angle) * radius
      );
      
      // Update trace line endpoints relative to ground
      projLine.position.y = 0;
      projLine.scale.y = targetHeight / 100;

      radarGroup.add(targetGroup);
      targets.push({
        group: targetGroup,
        mesh: inner,
        hex,
        projLine,
        height: targetHeight,
        angle,
        radius,
        seed: Math.random() * 10
      });
    }

    scene.add(radarGroup);

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
      camera.position.y += (-mouseY + 120 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Sweep rotation
      const sweepAngle = -time * 0.65;
      sweep.rotation.z = sweepAngle;

      // Animate threat targets
      targets.forEach((tgt, i) => {
        // Float movement
        tgt.group.position.y = tgt.height + Math.sin(time * 1.5 + tgt.seed) * 4;
        
        // Spin node and A.T. Field
        tgt.mesh.rotation.y = time * (0.8 + i * 0.3);
        tgt.mesh.rotation.x = Math.sin(time * 0.5) * 0.2;
        tgt.hex.rotation.z = -time * 0.4;
        
        // Pulse hex scale
        const scalePulse = 1.0 + Math.sin(time * 3 + tgt.seed) * 0.08;
        tgt.hex.scale.set(scalePulse, scalePulse, scalePulse);

        // Adjust projection line to floor level
        tgt.projLine.scale.y = tgt.group.position.y / 100;
        tgt.projLine.position.y = -tgt.group.position.y / 2;
      });

      // Animate/Scan radar particles (brighten particles currently inside the radar sweep)
      const positions = particlesGeo.getAttribute('position');
      const pArr = positions.array;
      const normalizedSweep = (sweepAngle % (Math.PI * 2)) + (sweepAngle < 0 ? Math.PI * 2 : 0);

      for (let i = 0; i < particleCount; i++) {
        // Calculate particle angle relative to sweep angle
        let pAngle = angles[i] + time * 0.02; // Slow particle drift
        if (pAngle > Math.PI * 2) pAngle -= Math.PI * 2;
        
        pArr[i * 3] = Math.cos(pAngle) * radii[i];
        pArr[i * 3 + 2] = Math.sin(pAngle) * radii[i];

        // Sweep wedge angle range check
        let diff = (pAngle - normalizedSweep) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;
        
        if (diff < Math.PI / 4) {
          // Inside the sweep wedge, bright flash
          pArr[i * 3 + 1] = heights[i] + Math.sin(time * 2 + i) * 1.5;
        }
      }
      positions.needsUpdate = true;

      // Rotate whole radar arena slightly
      radarGroup.rotation.y = Math.sin(time * 0.03) * 0.06;

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
      domeGeo.dispose();
      domeMat.dispose();
      
      rings.forEach(r => {
        r.geometry.dispose();
        r.material.dispose();
      });

      axesGroup.children.forEach(a => {
        a.geometry.dispose();
        a.material.dispose();
      });

      sweepGeo.dispose();
      sweepMat.dispose();

      particlesGeo.dispose();
      particlesMat.dispose();

      targets.forEach(tgt => {
        tgt.mesh.geometry.dispose();
        tgt.mesh.material.dispose();
        tgt.hex.geometry.dispose();
        tgt.hex.material.dispose();
        tgt.projLine.geometry.dispose();
        tgt.projLine.material.dispose();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container angels-bg" ref={mountRef}>
      <div className="nerv-scanner-laser red-laser"></div>
      <div className="blood-overlay"></div>
      
      {/* NERV Central Alert Tactical HUD */}
      <div className="angels-radar-overlay">
        <div className="radar-alert-banner">
          <div className="alert-stripes"></div>
          <div className="radar-status flicker">EMERGENCY: PATTERN BLUE CONFIRMED</div>
          <div className="alert-stripes"></div>
        </div>

        {/* Tactical Crosshair / Targets indicator */}
        <div className="radar-target-container">
          <div className="radar-target-tag border-decor">
            <span className="target-code">CODE: TYPE-03</span>
            <span className="target-loc font-mono">AZIMUTH: {threat.azimuth}° // ELEVATION: {threat.elevation}°</span>
            <div className="tracking-blink">TRACKING ACTIVE</div>
          </div>
        </div>

        <div className="radar-footer-data font-mono">
          <div>DEFENSE_POSTURE: LEVEL_1 // RANGE: {threat.range}M</div>
          <div>VELOCITY: MACH_{threat.velocity} // A.T._FIELD: {threat.atField}</div>
          <div>INTERCEPT_TIME_REMAINING: 240S</div>
        </div>

        {/* Tactical Corner Overlays */}
        <div className="radar-corner tc-top-left"></div>
        <div className="radar-corner tc-top-right"></div>
        <div className="radar-corner tc-bottom-left"></div>
        <div className="radar-corner tc-bottom-right"></div>
      </div>
    </div>
  );
};

export default AngelsBackground;
