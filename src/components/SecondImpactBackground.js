import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const SecondImpactBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0000); // Dark crimson-black void

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 45, 180);
    camera.lookAt(0, 15, -60);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Volumetric fog tinting the sky red
    scene.fog = new THREE.FogExp2(0x0a0000, 0.0035);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xff3300, 0.25);
    scene.add(ambientLight);

    const impactLight = new THREE.PointLight(0xffffff, 4.0, 500);
    impactLight.position.set(0, 80, -250);
    scene.add(impactLight);

    // Red ocean: combination of a solid specular plane and a wireframe top grid
    const oceanGeo = new THREE.PlaneGeometry(1200, 1200, 48, 48);
    
    // 1. Glossy Solid Ocean Surface
    const solidOceanMat = new THREE.MeshPhongMaterial({
      color: 0x4a0000,
      emissive: 0x110000,
      specular: 0xff3b00,
      shininess: 90,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const solidOcean = new THREE.Mesh(oceanGeo, solidOceanMat);
    solidOcean.rotation.x = -Math.PI / 2;
    solidOcean.position.y = -35;
    scene.add(solidOcean);

    // 2. Tactical Red Grid Ocean Overlay
    const gridOceanMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const gridOcean = new THREE.Mesh(oceanGeo, gridOceanMat);
    gridOcean.rotation.x = -Math.PI / 2;
    gridOcean.position.y = -34.8; // Slightly above solid
    scene.add(gridOcean);

    // 3. Adam's Core (White Giant Soul Sphere)
    const giantGeo = new THREE.SphereGeometry(40, 32, 32);
    const giantMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const giant = new THREE.Mesh(giantGeo, giantMat);
    giant.position.set(0, 80, -250);
    scene.add(giant);

    const outerShellGeo = new THREE.SphereGeometry(50, 16, 16);
    const outerShellMat = new THREE.MeshBasicMaterial({
      color: 0xff9999,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const outerShell = new THREE.Mesh(outerShellGeo, outerShellMat);
    outerShell.position.set(0, 80, -250);
    scene.add(outerShell);

    // 4. Four Massive Vertical Crosses of Light (Second Impact signature)
    const crossGroup = new THREE.Group();
    const crosses = [];

    const pVertGeo = new THREE.CylinderGeometry(1.5, 4.5, 400, 16, 1, true);
    const pHorzGeo = new THREE.CylinderGeometry(1.5, 2.5, 100, 16, 1, true);
    const crossMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const crossOffsets = [
      { x: -70, z: -270, angle: 0.1 },
      { x: -25, z: -240, angle: -0.05 },
      { x: 25, z: -240, angle: 0.05 },
      { x: 70, z: -270, angle: -0.1 }
    ];

    crossOffsets.forEach((offset, idx) => {
      const crossUnit = new THREE.Group();
      crossUnit.position.set(offset.x, 150, offset.z);
      
      // Vertical bar
      const vertBar = new THREE.Mesh(pVertGeo, crossMat);
      crossUnit.add(vertBar);

      // Horizontal bar
      const horzBar = new THREE.Mesh(pHorzGeo, crossMat);
      horzBar.rotation.z = Math.PI / 2;
      horzBar.position.y = 80; // height of the cross arm
      crossUnit.add(horzBar);

      crossUnit.rotation.y = offset.angle;
      crossGroup.add(crossUnit);
      crosses.push({
        group: crossUnit,
        seed: Math.random() * 10,
        speed: 0.4 + Math.random() * 0.4
      });
    });
    scene.add(crossGroup);

    // 5. Concentric expanding particle shockwaves (Expanding halos)
    const shockwaveCount = 350;
    const shockwaveGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(shockwaveCount * 3);
    const angles = new Float32Array(shockwaveCount);
    const expansionSpeeds = new Float32Array(shockwaveCount);
    const initialRadii = new Float32Array(shockwaveCount);

    const initWaveParticle = (i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 30;
      angles[i] = angle;
      initialRadii[i] = r;
      expansionSpeeds[i] = 1.2 + Math.random() * 2.0;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = -34 + (Math.random() - 0.5) * 2; // ocean level
      positions[i * 3 + 2] = -250 + Math.sin(angle) * r;
    };

    for (let i = 0; i < shockwaveCount; i++) {
      initWaveParticle(i);
    }
    
    shockwaveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const shockwaveMat = new THREE.PointsMaterial({
      color: 0xff4400,
      size: 2.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const shockwaves = new THREE.Points(shockwaveGeo, shockwaveMat);
    scene.add(shockwaves);

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
      camera.position.y += (-mouseY + 45 - camera.position.y) * 0.05;
      camera.lookAt(0, 15, -60);

      // Animate ocean waves (deform geometry vertices)
      const posAttr = solidOcean.geometry.attributes.position;
      const waveCoords = posAttr.array;
      for (let i = 0; i < waveCoords.length; i += 3) {
        const x = waveCoords[i];
        const y = waveCoords[i + 1];
        waveCoords[i + 2] = Math.sin(x * 0.02 + time * 1.6) * 5.0 + Math.cos(y * 0.02 + time * 1.6) * 5.0;
      }
      posAttr.needsUpdate = true;
      gridOcean.geometry.attributes.position.needsUpdate = true;

      // Spin Adam sphere and outer cage
      giant.scale.setScalar(1.0 + Math.sin(time * 6) * 0.06);
      outerShell.rotation.y = time * 0.15;
      outerShell.rotation.z = time * 0.08;

      // Animate 4 vertical crosses of light (sway and pulse intensity)
      crosses.forEach((c, idx) => {
        c.group.position.x = crossOffsets[idx].x + Math.sin(time * c.speed + c.seed) * 5;
        const pulse = 0.8 + Math.sin(time * 3 + c.seed) * 0.2;
        c.group.children.forEach(bar => {
          bar.material.opacity = 0.4 * pulse;
        });
      });

      // Animate expanding shockwave particles outwards from Adam (0, 0, -250)
      const pPosAttr = shockwaveGeo.getAttribute('position');
      const pCoords = pPosAttr.array;
      for (let i = 0; i < shockwaveCount; i++) {
        // Expand radius
        initialRadii[i] += expansionSpeeds[i];
        
        pCoords[i * 3] = Math.cos(angles[i]) * initialRadii[i];
        pCoords[i * 3 + 2] = -250 + Math.sin(angles[i]) * initialRadii[i];

        // Reset particle on maximum radius
        if (initialRadii[i] > 380) {
          initWaveParticle(i);
        }
      }
      pPosAttr.needsUpdate = true;

      // Pulse main light source
      impactLight.intensity = 3.5 + Math.sin(time * 5) * 0.7;

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
      oceanGeo.dispose();
      solidOceanMat.dispose();
      gridOceanMat.dispose();
      giantGeo.dispose();
      giantMat.dispose();
      outerShellGeo.dispose();
      outerShellMat.dispose();
      pVertGeo.dispose();
      pHorzGeo.dispose();
      crossMat.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container second-impact-bg" ref={mountRef}>
      <div className="ocean-overlay"></div>
      
      {/* NERV Ground Zero monitoring diagnostic overlay */}
      <div className="impact-overlay font-mono">
        <div className="impact-header-panel">
          <div className="impact-date">SEPTEMBER_13_2000</div>
          <div className="impact-location">ANTARCTICA // GROUND_ZERO // ADAM_LAB</div>
        </div>

        {/* Tactical Crosshair overlay */}
        <div className="impact-target-indicator">
          <div className="impact-alert blink-slow">WHITE_GIANT: DETONATION_ANOMALY</div>
          <div className="coord-grid">
            <div>LAT: 82° 06' S // LON: 54° 58' E</div>
            <div>THERMAL_INDEX: CRITICAL</div>
            <div>A.T._FIELD_EXPANSION: 1200KM</div>
          </div>
        </div>

        <div className="impact-footer-overlay">
          <div>THERMAL_ANOMALY: RADIATIVE_DECAY // SYS_HARMONIC_LEVEL: NONE</div>
          <div>WARNING: MARINE_BIOTA_EXTINCTION_CONFIRMED</div>
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

export default SecondImpactBackground;
