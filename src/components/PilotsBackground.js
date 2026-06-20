import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const PilotsBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) {
      console.error("Three.js not found!");
      return;
    }
    console.log("Initializing Pilots 3D Background...");

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Wireframe Grid
    const gridGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2.5;
    grid.position.y = -50;
    scene.add(grid);

    // Floating Sync-rate Cubes
    const cubes = [];
    const cubeCount = 15;
    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * 5 + 2;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      scene.add(cube);
      cubes.push(cube);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 2, 500);
    pointLight.position.set(0, 50, 50);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      grid.rotation.z += 0.001;

      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.1;
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
      // Clean up Three.js resources
      gridGeometry.dispose();
      gridMaterial.dispose();
      cubes.forEach(c => {
        c.geometry.dispose();
        c.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container pilots-bg" ref={mountRef}>
      <div className="pilots-vignette"></div>
      <div className="pilots-data-overlay">
        <div className="sync-rate-container">
          <div className="sync-label">SYNC_RATE: 41.3%</div>
          <div className="sync-bar-wrapper">
            <div className="sync-bar-active" style={{ width: '41.3%' }}></div>
          </div>
        </div>
        <div className="neural-connection">
          NEURAL_CONNECTION: ACTIVE
        </div>
      </div>
    </div>
  );
};

export default PilotsBackground;
