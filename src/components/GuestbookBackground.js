import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';
import logo from '../img/mainimg.png';

const THREE = window.THREE;
const SimplexNoise = window.SimplexNoise;

const GuestbookBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!THREE || !SimplexNoise) {
      console.error("Three.js or SimplexNoise not found on window object.");
      return;
    }

    const mount = mountRef.current;
    const simplex = new SimplexNoise();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040100); // Deep amber-black background

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 1.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    // Fog
    scene.fog = new THREE.Fog(0x040100, 1.0, 4.0);

    const archiveGroup = new THREE.Group();

    // 1. Central NERV Logo Plane
    const geometry = new THREE.PlaneGeometry(1.8, 1.8, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(logo);
    texture.encoding = THREE.sRGBEncoding;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    archiveGroup.add(plane);

    // 2. Surrounding Database Point Cylinder (glowing mainframe columns)
    const serverCount = 300;
    const serverGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(serverCount * 3);
    const serverHeights = new Float32Array(serverCount);
    const serverRadii = new Float32Array(serverCount);
    const serverAngles = new Float32Array(serverCount);

    for (let i = 0; i < serverCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 0.8;
      const h = (Math.random() - 0.5) * 3.0;

      serverAngles[i] = angle;
      serverRadii[i] = r;
      serverHeights[i] = h;

      posArr[i * 3] = Math.cos(angle) * r;
      posArr[i * 3 + 1] = h;
      posArr[i * 3 + 2] = Math.sin(angle) * r;
    }
    serverGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const serverMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 0.015,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const serverMainframe = new THREE.Points(serverGeo, serverMat);
    archiveGroup.add(serverMainframe);

    // 3. Orbiting Data Line Rings
    const ringGroup = new THREE.Group();
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xff3c00,
      transparent: true,
      opacity: 0.15
    });

    for (let i = 0; i < 4; i++) {
      const points = [];
      const ringRadius = 1.3 + i * 0.3;
      for (let theta = 0; theta <= 64; theta++) {
        const angle = (theta * Math.PI * 2) / 64;
        points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.position.y = (i - 1.5) * 0.6;
      ringGroup.add(ringLine);
    }
    archiveGroup.add(ringGroup);

    scene.add(archiveGroup);

    // Light source
    const pointLight = new THREE.PointLight(0xff5500, 1.5, 5);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0018;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0018;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation based on cursor coordinates
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Sway NERV logo plane using Simplex Noise
      const position = plane.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = simplex.noise3D(x * 0.5 + time * 0.1, y * 0.5 + time * 0.1, time * 0.1) * 0.12;
        position.setZ(i, z);
      }
      position.needsUpdate = true;

      // Rotate whole database archive
      archiveGroup.rotation.y = time * 0.08;
      serverMainframe.rotation.y = -time * 0.03;

      // Pulse NERV logo opacity
      material.opacity = 0.15 + Math.sin(time * 2.0) * 0.04;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (composer) {
        composer.setSize(mount.clientWidth, mount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      // Cleanup assets
      geometry.dispose();
      material.dispose();
      texture.dispose();
      serverGeo.dispose();
      serverMat.dispose();
      ringGroup.children.forEach(r => r.geometry.dispose());
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* NERV Database Terminal HUD Overlay */}
      <div className="guestbook-bg-overlay font-mono">
        <div className="gb-header-panel">
          <div className="gb-title">NERV_COM_LOG // DIR_025</div>
          <div className="gb-net-status">NET_SYNC: ENCRYPTED_CHANNEL</div>
        </div>

        <div className="gb-decor-grid">
          <svg className="gb-decor-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255, 106, 0, 0.15)" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255, 106, 0, 0.15)" strokeWidth="0.5" />
            <rect x="10" y="30" width="80" height="40" fill="none" stroke="rgba(255, 106, 0, 0.08)" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="gb-footer-panel">
          <div>COMMUNICATION_ARCHIVE // LEVEL_4_RESTRICTED // HUMAN INSTRUMENTALITY PROJECT</div>
          <div>DATABASE_CAPACITY: 84.6% // ACTIVE_NODES: 104</div>
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

export default GuestbookBackground;