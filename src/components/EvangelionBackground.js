import React, { useEffect, useRef } from 'react';

const EvangelionBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Blueprint Grid
    const size = 1000;
    const divisions = 40;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x0066ff, 0x002266);
    gridHelper.rotation.x = Math.PI / 4;
    scene.add(gridHelper);

    // Wireframe Evangelion Unit Representation (Abstract)
    const unitGroup = new THREE.Group();
    
    // Core
    const coreGeo = new THREE.SphereGeometry(20, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true, transparent: true, opacity: 0.3 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    unitGroup.add(core);

    // Armor Plates (Abstract)
    for (let i = 0; i < 4; i++) {
      const plateGeo = new THREE.BoxGeometry(40, 60, 5);
      const plateMat = new THREE.MeshBasicMaterial({ color: 0x0044cc, wireframe: true, transparent: true, opacity: 0.2 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(
        Math.cos(i * Math.PI / 2) * 50,
        0,
        Math.sin(i * Math.PI / 2) * 50
      );
      plate.lookAt(0, 0, 0);
      unitGroup.add(plate);
    }

    scene.add(unitGroup);

    // Floating Data Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 500;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: 0x00aaff, size: 2, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      unitGroup.rotation.y += 0.002;
      unitGroup.rotation.x += 0.001;
      gridHelper.rotation.z += 0.0005;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container eva-bg" ref={mountRef}>
      <div className="eva-blueprint-overlay">
        <div className="blueprint-header">EVANGELION_UNIT_01 // SCHEMATICS</div>
        <div className="blueprint-data-left">
          <div>MODEL: TEST_TYPE</div>
          <div>POWER: INTERNAL_BATTERY</div>
          <div>STATUS: NOMINAL</div>
        </div>
        <div className="blueprint-data-right">
          <div>PLATE_A: SECURE</div>
          <div>PLATE_B: SECURE</div>
          <div>CORE_TEMP: 36.5C</div>
        </div>
      </div>
    </div>
  );
};

export default EvangelionBackground;
