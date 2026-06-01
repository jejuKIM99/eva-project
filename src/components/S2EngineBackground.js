import React, { useEffect, useRef } from 'react';

const S2EngineBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // S2 Core (Fruit of Life)
    const coreGroup = new THREE.Group();
    
    // Nested Icosahedrons
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.IcosahedronGeometry(20 + i * 20, 0);
      const mat = new THREE.MeshBasicMaterial({ 
        color: 0xff3300, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.5 - i * 0.1 
      });
      const mesh = new THREE.Mesh(geo, mat);
      coreGroup.add(mesh);
    }
    scene.add(coreGroup);

    // Energy Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 400;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: 0xff5500, size: 2, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      
      coreGroup.rotation.y += 0.01;
      coreGroup.rotation.z += 0.005;
      
      coreGroup.children.forEach((mesh, i) => {
        mesh.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + i) * 0.1);
      });
      
      particles.rotation.y -= 0.002;
      
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
      coreGroup.children.forEach(m => { m.geometry.dispose(); m.material.dispose(); });
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container s2-bg" ref={mountRef}>
      <div className="s2-overlay">
        <div className="s2-title">S²_ENGINE // SUPER_SOLENOID</div>
        <div className="s2-energy">ENERGY_OUTPUT: INFINITE</div>
        <div className="s2-status">FRUIT_OF_LIFE // DETECTED</div>
        <div className="s2-warning">WARNING: UNLIMITED_POWER_CURVE</div>
      </div>
    </div>
  );
};

export default S2EngineBackground;
