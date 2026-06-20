import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const AngelsBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Radar Rings
    const rings = [];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.RingGeometry(i * 40, i * 40 + 1, 64);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      rings.push(ring);
    }

    // Radar Sweep
    const sweepGeo = new THREE.CircleGeometry(200, 32, 0, Math.PI / 4);
    const sweepMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    const sweep = new THREE.Mesh(sweepGeo, sweepMat);
    sweep.rotation.x = Math.PI / 2;
    scene.add(sweep);

    // Angel Detections (Random Dots)
    const dots = [];
    for (let i = 0; i < 3; i++) {
      const dotGeo = new THREE.SphereGeometry(3, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(
        (Math.random() - 0.5) * 300,
        0,
        (Math.random() - 0.5) * 300
      );
      scene.add(dot);
      dots.push(dot);
    }

    // Scanning Beam
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 400, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    scene.add(beam);

    const animate = () => {
      requestAnimationFrame(animate);
      sweep.rotation.z -= 0.02;
      beam.rotation.y += 0.01;
      
      dots.forEach((dot, i) => {
        dot.scale.setScalar(1 + Math.sin(Date.now() * 0.005 + i) * 0.5);
      });

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
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      rings.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      sweepGeo.dispose();
      sweepMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      dots.forEach(d => { d.geometry.dispose(); d.material.dispose(); });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container angels-bg" ref={mountRef}>
      <div className="angels-radar-overlay">
        <div className="radar-status flicker">PATTERN_BLUE // CONFIRMED</div>
        <div className="radar-target">TARGET: ANGEL_DETECTED</div>
        <div className="radar-data">
          <div>DISTANCE: 12,000M</div>
          <div>VELOCITY: MACH_2.5</div>
          <div>A.T._FIELD: ACTIVE</div>
        </div>
      </div>
      <div className="blood-overlay"></div>
    </div>
  );
};

export default AngelsBackground;
