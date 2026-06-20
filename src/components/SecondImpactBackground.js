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
    scene.background = new THREE.Color(0x200000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 50, 200);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Red Ocean
    const oceanGeo = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    const oceanMat = new THREE.MeshBasicMaterial({ color: 0x8b0000, wireframe: true, transparent: true, opacity: 0.3 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -20;
    scene.add(ocean);

    // Atmospheric Light (White Giant)
    const giantGeo = new THREE.SphereGeometry(50, 32, 32);
    const giantMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const giant = new THREE.Mesh(giantGeo, giantMat);
    giant.position.set(0, 100, -300);
    scene.add(giant);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const positions = ocean.geometry.attributes.position.array;
      const time = Date.now() * 0.001;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.05 + time) * 5 + Math.cos(y * 0.05 + time) * 5;
      }
      ocean.geometry.attributes.position.needsUpdate = true;
      
      giant.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);
      
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
      oceanGeo.dispose();
      oceanMat.dispose();
      giantGeo.dispose();
      giantMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container second-impact-bg" ref={mountRef}>
      <div className="impact-overlay">
        <div className="impact-date">SEPTEMBER_13_2000</div>
        <div className="impact-location">ANTARCTICA // GROUND_ZERO</div>
      </div>
      <div className="ocean-overlay"></div>
    </div>
  );
};

export default SecondImpactBackground;
