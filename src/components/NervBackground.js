import React, { useEffect, useRef } from 'react';

const NervBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0500);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Tactical Floor Grid
    const gridHelper = new THREE.GridHelper(1000, 50, 0xff6600, 0x331100);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // MAGI Hexagons
    const hexGroup = new THREE.Group();
    const hexGeo = new THREE.CylinderGeometry(20, 20, 5, 6);
    const hexMat = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: true, transparent: true, opacity: 0.2 });
    
    for (let i = 0; i < 6; i++) {
      const hex = new THREE.Mesh(hexGeo, hexMat);
      hex.position.set(
        Math.cos(i * Math.PI / 3) * 80,
        Math.sin(i * Math.PI / 3) * 40,
        (Math.random() - 0.5) * 50
      );
      hex.rotation.x = Math.PI / 2;
      hexGroup.add(hex);
    }
    scene.add(hexGroup);

    // Floating Data Lines
    const lineGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const points = [];
      points.push(new THREE.Vector3((Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 200));
      points.push(new THREE.Vector3((Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 200));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.1 });
      const line = new THREE.Line(lineGeo, lineMat);
      lineGroup.add(line);
    }
    scene.add(lineGroup);

    const animate = () => {
      requestAnimationFrame(animate);
      hexGroup.rotation.y += 0.003;
      hexGroup.children.forEach((hex, i) => {
        hex.position.y = Math.sin(Date.now() * 0.001 + i) * 15;
        hex.rotation.z += 0.005;
      });
      lineGroup.rotation.z += 0.0005;
      gridHelper.rotation.y += 0.001;
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
      hexGeo.dispose();
      hexMat.dispose();
      lineGroup.children.forEach(l => { l.geometry.dispose(); l.material.dispose(); });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container nerv-bg" ref={mountRef}>
      <div className="nerv-scanline"></div>
      <div className="nerv-magi-overlay">
        <div className="magi-title">MAGI_SYSTEM // B.M.C.</div>
        <div className="magi-nodes">
          <div className="node melchior">MELCHIOR-1: <span className="status">PRIORITY_A</span></div>
          <div className="node balthasar">BALTHASAR-2: <span className="status">PRIORITY_A</span></div>
          <div className="node casper">CASPER-3: <span className="status">PRIORITY_A</span></div>
        </div>
        <div className="nerv-bottom-data">
          NERV_HQ // GEOGRAPHY_SCAN // GEO_FRONT_LEVEL_12
        </div>
      </div>
    </div>
  );
};

export default NervBackground;
