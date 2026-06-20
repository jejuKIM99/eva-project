import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';

const LCLBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3d1c00);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
mountRef.current.appendChild(renderer.domElement);

const composer = initCrtComposer(THREE, renderer, scene, camera);

// LCL Bubbles
const bubbleGroup = new THREE.Group();
const bubbleGeo = new THREE.SphereGeometry(2, 16, 16);
const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.2 });

const bubbles = [];
for (let i = 0; i < 50; i++) {
  const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  bubble.position.set(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 100
  );
  bubble.scale.setScalar(Math.random() * 2 + 0.5);
  bubbleGroup.add(bubble);
  bubbles.push({
    mesh: bubble,
    speed: Math.random() * 0.1 + 0.05
  });
}
scene.add(bubbleGroup);

// Atmospheric Fog
scene.fog = new THREE.Fog(0x3d1c00, 30, 150);


    const animate = () => {
      requestAnimationFrame(animate);
      
      bubbles.forEach(b => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > 100) b.mesh.position.y = -100;
        b.mesh.position.x += Math.sin(Date.now() * 0.001 + b.mesh.position.y) * 0.1;
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
      bubbleGeo.dispose();
      bubbleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container lcl-bg" ref={mountRef}>
      <div className="lcl-overlay">
        <div className="lcl-density">LCL_DENSITY: 99.8%</div>
        <div className="lcl-oxygen">OXYGEN_REPLACEMENT: ACTIVE</div>
        <div className="lcl-status">PRIMORDIAL_SOUP // CONNECTED</div>
      </div>
    </div>
  );
};

export default LCLBackground;
